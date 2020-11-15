---
title: AWS Cognito Auth Mock
date: '2020-11-15'
show: 'no'
image: 'cognito.jpg'
tags: ['de', '2020', 'aws', 'cdk', 'postman', 'cognito']
engUrl: https://martinmueller.dev/cdk-cognito-eng
pruneLength: 50
---

Ahoi AWS'ler

In meinem [AWS Projekt](https://martinmueller.dev/alf-provisioner), bei dem ich per REST API Alfresco Instanzen Starten, Stoppen und Terminieren kann, verwende ich für die Userverwaltung AWS Cognito als Identity Provider. Cognito macht es mir einfach neue Nutzer anzulegen und ihnen die Rechte zu geben auf die REST API zugreifen zu können.

Das REST API ist mittels AWS API Gateway implementiert und ein Cognito Authorizer erlaubt den Nutzern aus dem Cognito Identity Pool auf die Endpoints zuzugreifen.

Besonders wichtig ist der Cognito Authorizer da ich einen Permission Layer eingebaut habe der verhindert das Nutzer Alfresco Instanzen von anderen Nutzern Abfragen oder Manipulieren können. Prinzipiell funktioniert der Permission Layer mit den vom Cognito Authorizationsprozess zurückgegebenen User ID, wenn die Authorisation erfolgreich war.

Das funktioniert super, allerdings hätte ich gerne zum testen der Funktionalität des Permission Layers automatisierte Tests. Toll wäre es wenn ich dafür Postman verwenden könnte. Leider ist das nicht möglich da der Authentisierungsprozess mit Cognito eine User Interaktion benötigt um die Credentials abzufragen.

Die Lösung für mich war einen Mock Authentication Layer zu schreiben welcher das genau Verhalten des Cognito Authorizer simuliert. Dafür habe ich Middy verwendet. Was Middy ist und wie genau meine Lösung aussieht beschreibe ich in den nächsten Abschnitten.

# Middy als Mock Auth Layer
[Middy](https://github.com/middyjs/middy) ist ein einfaches Framework zum Bauen von Layers in Lambda Funktionen. Damit ist es möglich alle Features die nicht direkt zur Business Logik gehören in Layers zu kapseln. In meinem Fall möchte ich einen Mock Auth Layer implementieren der die Cognito Authorisation simuliert. Dieser Layer soll dann optional per Environmental Variable an und ausschaltbar sein.

Der komplette Code für den Auth Layer findet ihr bei mir auf [GitHub](https://github.com/mmuller88/alf-cdk/blob/master/src/util/mockAuthLayer.ts).

```TypeScript
const mockAuthLayer = (config?: MockAuthLayerConfig) => {
  return {
    before: (handler: any, next: () => void) => {
      handler.event = handler.event ?? {};
      handler.event.headers = handler.event.headers ?? {};
      const mockHeaderPrefix = config?.mockHeaderPrefix || 'MOCK_AUTH_';
      Object.keys(handler.event.headers)
        .filter((headerKey) => {
          return headerKey.startsWith(mockHeaderPrefix);
        })
        .forEach((headerKey) => {
          const headerValue = handler.event.headers[headerKey] || 'martin';
          handler.event.requestContext = handler.event.requestContext ?? {};
          handler.event.requestContext.authorizer = handler.event.requestContext.authorizer ?? {};
          handler.event.requestContext.authorizer.claims = handler.event.requestContext.authorizer.claims ?? {};
          handler.event.requestContext.authorizer.claims[
            headerKey.substring(mockHeaderPrefix.length).replace(/&/g, ':')
          ] = headerValue;
          console.log(`shifted header ${JSON.stringify(handler)}`);
        });
      next();
    },
  };
};
```

Ok schauen wir uns den Code mal an.

```TypeScript
const mockHeaderPrefix = config?.mockHeaderPrefix || 'MOCK_AUTH_';
  Object.keys(handler.event.headers)
    .filter((headerKey) => {
      return headerKey.startsWith(mockHeaderPrefix);
      ...
```

Ich filtere also alle Headers die mit einem bestimmten Prefix beginnen. Falls keiner gesetzt wurde verwende ich **MOCK_AUTH**.

```TypeScript
const headerValue = handler.event.headers[headerKey] || 'martin';
  handler.event.requestContext = handler.event.requestContext ?? {};
  handler.event.requestContext.authorizer = handler.event.requestContext.authorizer ?? {};
  handler.event.requestContext.authorizer.claims = handler.event.requestContext.authorizer.claims ?? {};
  handler.event.requestContext.authorizer.claims[
    headerKey.substring(mockHeaderPrefix.length).replace(/&/g, ':')
  ] = headerValue;
```

Dann werden die Headers in den Authorizer Claims Bereich kopiert welche auch die Cognito Values enthalten würden. Somit steht meiner Lambda z.B. der authentisierte User und Rolle zu Verfügung. Wie nun die MOCK_AUTH_ Header gesetzt werden können zeige ich im nächsten Abschnitt.

Am Schluss mit **.replace(/&/g, ':')** findet noch ein kleines Symbol Replacing statt da Postman es leider nicht erlaubt Doppelpunkte **:** im Header Key zu verwenden.

# Lambda Unit Tests
Für meine Lambdas habe ich Unit Tests geschrieben die auch die Authorisation mitberücksichtigen sollen. Aus meinem Code picke ich mir eine Unit Test Datei auf [GitHub](https://github.com/mmuller88/alf-cdk/blob/master/test/get-all-conf-api.spec.ts) heraus und erkläre diese genauer.

```TypeScript
...
it('from himself will success', async (done) => {
  awsSdkPromiseResponse.mockReturnValueOnce({ Items: [{ instanceId: 'i123', userId: 'martin' }] });
  await handler(
    {
      headers: {
        'MOCK_AUTH_cognito:username': 'martin',
        'MOCK_AUTH_cognito:groups': 'Admin',
      },
      queryStringParameters: { userId: 'martin' },
    },
    {} as Context,
    (_, result) => {
      expect(result?.statusCode).toBe(200);
      ...
```

Also wie wir hier sehen verwende ich den Mock Header **MOCK_AUTH_cognito:username': 'martin'** und **'MOCK_AUTH_cognito:groups': 'Admin'** . Damit simuliere ich einfach das Authorisationsverhalten von Cognito und mache den Usernamen und die Usergruppen zur Laufzeit der Lambda bekannt. Fair enough.

# Postman Tests
Natürlich sollen auch meine Postmantests den neuen Auth Mock Layer nutzen können. Auf [GitHub](https://github.com/mmuller88/alf-cdk-api-gw/blob/master/test/alf-cdk.postman_collection.json) habe ich eine Postman Collection mit über 40 Requests. Die gesamte Collection wird mittels Newman nach dem Bau der DEV Umgebung als Integrationtest ausgeführt:

```TypeScript
  ...
  testCommands: (stageAccount) => [
    ...(stageAccount.stage === "dev"
      ? [
          `npx newman run test/alf-cdk.postman_collection.json --env-var baseUrl=$RestApiEndPoint -r cli,json --reporter-json-export tmp/newman/report.json --export-environment tmp/newman/env-vars.json --export-globals tmp/newman/global-vars.json; RESULT=$? || \,
          ./scripts/cleanup.sh
          exit $RESULT`,
        ]
      : []),
  ],
  ...
```

Um nun den Mock Auth Layer zu nutzen müssen einfach die Header gesetzt werden, wie auch schon bei den Unit Tests im vorherigen Abschnitt:

```
MOCK_AUTH_cognito&username = martin
MOCK_AUTH_cognito&groups = Admin
```

Aber eine Änderung musste ich vornehmen. Postman erlaubt es nicht einen Doppelpunkt im Header Key zu haben. Also musste ich dafür ein Symbol Replacing einbauen. Das UND Zeichen **&** wird im Code zum Doppelpunkt **:** übersetzt.

Falls dich das Thema Testen mit CDK interessiert kann ich dir meinen Blog Post von [letzter Woche](https://martinmueller.dev/pipeline-testing) empfehlen.

# Zusammenfassung
AWS Cognito ist mega cool und schnell aufgebaut. Es ermöglicht eine Palette von tollen User Verwaltungs Funktionen. Leider ist es nicht möglich den Cognito Authorisationsprocess komplett automatisiert z.B. für automatische Tests durchzuführen. Aber das macht nichts da ich mit meinem Auth Mock Layer einfach die Authorisation von Cognito simuliere. Nun zu euch. Hat euch der Beitrag gefallen? Wollt ihr mehr wissen? Sagt mir Bescheid.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>