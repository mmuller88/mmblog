---
title: AWS CDK Let's build a Platform - Api GateWay
show: 'no'
date: '2020-09-13'
image: 'frontend.png'
tags: ['de', '2020', 'aws', 'react', 'cdk', 'nofeed']
engUrl: https://martinmueller.dev/cdk-platform-api-gw
pruneLength: 50
---

Hi CDK Fans,

Willkommen zurück zu meiner kleinen Serie über "AWS CDK Let's build a platform. In der vorherigen Episode  [AWS CDK Let's build a Platform - Frontend](https://martinmueller.dev/cdk-platform-frontend) habe ich erklärt wie wir für meine Firma [unimed.de](https://unimed.de) ein cooles static React Web App mit AWS CDK bauen.

AWS CDK ist ein Framework zur Erstellung und Anwendung von Cloudformation Templates. Dabei kann man zwischen gängigen Programmiersprachen wie Java, Python oder TypeScript auswählen. Wir haben uns für TypeScript entschieden. Wenn du mehr über AWS CDK wissen möchtest empfehle ich dir meine anderen Posts hier in meinem Blog wie z.B. [cdk-example](https://martinmueller.dev/cdk-example).

In dieser Folge soll es um das AWS Api Gateway gehen welches von der Frontend Applikation benutzt wird um z.B. interne Date abzufragen und abzuspeichern.

# Api Gateway
Das AWS Api Gateway ist das Herzstück viele AWS Deployments. Es ist ein REST API zum verarbeiten von Requests und den darauf folgenden Responses. Sollen zum Beispiel interne Daten erfragt werden könnte das mit diesem Request gemacht werden:

```
GET https://example.com/users
```

Der Response Body könnte dann folgender Maßen aussehen:

```JSON
[
    {"user":"Alice", "age":18},
    {"user":"Bob", "age":19}
]
```

Das Api Gateway nimmt also ein Request entgegen, leitet es zu so einer sogenannten Integration weiter und gibt dann einen Response zurück. Die Integration kann dabei mit verschieden Technologien erreicht werden wie z.B. Mock, HTTP Proxy, Lambda Proxy oder anderen AWS Servicen. Bei der Erstellung des API Gateways haben für uns für die Variante mit der openApi Spezifikation entschieden. Darüber hab ich ja schon in einem [vorherigen Post](https://martinmueller.dev/cdk-swagger) geschrieben und empfehle Euch den zu lesen.

Kurz zusammengefasst bietet die Verwendung einer openApi Spezifikation einige Vorteile wie Schema Validierung der Request Parameter sowie einer tollen Dokumentation über die zu erwartenden Responses und möglichen Fehlermeldungen. Insbesondere bei der Verwendung einer NoSQL Datenbank wie DynamoDB ist die Validierung der Request Parameter extrem wichtig da ja die Datenbank selber kein Schema vorgibt! Die Verwendung von openApi in CDK zeige euch hier:

```TypeScript
const api = new SpecRestApi(this, this.stackName, {
    apiDefinition: ApiDefinition.fromAsset(join(__dirname, './path/to/api-gw.yaml')),
});
```

Die openApi Spec hier mit Namen api-gw.yaml könnte zum Beispiel so ausehen:

```YAML
openapi: "3.0.1"
info:
  title: "example-endpoints"
  version: "2020-09-01T13:03:56Z"
paths:
  /enumerations:
    get:
      security:
      x-amazon-apigateway-integration:
        type: "aws_proxy"
        uri: "arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:example/invocations"
        passthroughBehavior: "when_no_match"
        httpMethod: "POST"
        credentials: "arn:aws:iam::@@ACCOUNT_ID@@:role/apiRole"
    options:
      responses:
        200:
          description: "200 response"
    ...
```

Benutzt ihr Lambdas für eure Integrationen, könnte ihr auch gleich hier dem Api Gateway erlauben auf eure Lambdas zuzugreifen:

```TypeScript
const apiRole = new Role(this, 'apiRole', {
    assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
});

apiRole.addToPolicy(new PolicyStatement({
    resources: ['*'],
    actions: ['lambda:InvokeFunction'],
}));
```

Alternative könnte ihr auch bei den Lambdas selbst dem Api Gateway die Permission geben diese aufzurufen.

Teil unsere Staging Pipeline, welche ich in einem der nachfolgenden Parts erläutern möchte, sind Integrationstests die nach jedem commit ausgeführt werden. Zurzeit sind es "nur" Postmantests die via Newman ausgeführt werden:

```
npx newman run test/postman/example-com.postman_collection.json --env-var baseUrl=http://example.com --env-var keycloakUrl=http://keycloak-dev.example.com  --env-var user=${testUserName} --env-var pass=${testUserPassword} -r cli,json --reporter-json-export tmp/newman/report.json
```

Die User Credentials werden vorher im Build per secure Environmentvariables gesetze, welche aus AWS SecurityManager geladen werden.

# Lambdas
* Lambdas als Integration
* Bekommen ihren eigenen Stack. Bessere Flexibilität

# Pipeline
* Staging Pipeline
* eigener Blog Post

# Zusammenfassung
...


Eine Plattform mittels AWS zu bauen ist aufregend und macht Spaß. Die komplette Infrastruktur als Code zu haben ist extrem Vorteilhaft. Es ermöglicht ein ausgeklügeltes Staging von zum Beispiel einer Dev Environment nach QA und dann nach Prod. Des Weiteren dient der Code als Dokumentation über was genau in AWS Deployed wurde und wird. Es ist auch viel weniger fehleranfällig als alles manuelle zusammenklicken zu müssen.

Hier habe ich euch den ersten Teil meiner "AWS CDK Let's build a Platform" Reihe vorgestellt. Ich erkläre welche Ressourcen unsere static Web App in AWS benötigt und wie diese mittels CDK verwaltet werden. Im nächsten Teil werde ich ausführlicher über unsere Staging Pipeline sprechen die quasi überall wiederverwendet wird um CDK Apps durch die verschiedenen Stages Dev, QA und Prod zu schleusen. Ich hoffe euch hat der Artikel gefallen und wenn ihr fragen habt, schreibt mir doch einfach.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>