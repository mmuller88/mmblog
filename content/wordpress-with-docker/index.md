---
title: Lets make Wordpress fun
show: 'no'
date: '2021-06-27'
# image: 'version-prs.png'
tags: ['de', '2021', 'github', 'docker'] #nofeed
engUrl: https://martinmueller.dev/wordpress-with-docker-eng
pruneLength: 50
---

Hi Leute!

Für meinen neusten Kunden habe ich ein tolles AWS Backend mit AWS AppSync und vielen tollen weiteren AWS Services gebaut. Nun stehe ich aber vor der spannende Aufgabe die AppSync bzw. GraphQL API in einem Wordpress Frontend aufrufbar zu machen. Ich habe schon viel über Wordpress gehört aber noch nie damit gearbeitet.

Auch wird das Wordpress auf [Raidbox.de](https://raidbox.de) gehostet was es etwas schwierig macht das Deployment direkt zu verwalten. Kommend aus der DevOps Welt will ich natürlich das Wordpress Deployment so angenehm und automatisiert wie möglich haben.
* Zwei Probleme alt es zu lösen. 1) Ich wollte Wordpress lokal zum Laufen bekommen 2) Es wäre cool wenn es versioniert wäre mit GitHub

# Wordpress
Wordpress ist ein Content Management System (CMS). Es wurde entwickelt zum erstellen von Blogposts. Es hat sich aber stark weiterentwickelt und wird nicht mehr nur für Blogposts benutzt. Über sogenannte Plugins werden neue Feature zu Wordpress hinzugefügt. Solche Features können sein eine Bezahlfunktion. Wir selber verwenden [Digimember](https://digimember.de) zum Verwalten eines Abobezahlsystems.

# Wordpress mit Docker
Zur Lösung meines ersten Problems, also Docker lokal zum Laufen zu bekommen, habe ich mich dafür entschlossen Docker zu benutzen. Zum Glück war ich nicht der erste der das versucht bzw. erfolgreich geschafft hat. Es gibt viele gute Anleitungen im Internet wie ein Wordpress Deployment mit Docker aufsetzen kann. Zur Orchestrierung der Docker Container verwende ich Docker Compose und hier ist der Code:

```yaml
version: '3.3'

services:
  wordpress:
    depends_on:
      - db
    image: wordpress:5.7.2
    volumes:
      - ./wordpress_files:/var/www/html
    ports:
      - "8080:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpressuser
      WORDPRESS_DB_NAME: wordpress_staging
      WORDPRESS_DB_PASSWORD: geheim
      WORDPRESS_HOME: 'http://localhost:8080'
      WORDPRESS_SITEURL: 'http://localhost:8080'

  db:
    image: mysql:5.7
    container_name: db
    volumes:
      - ./db_data:/var/lib/mysql
      - ./wordpress_files/wp-content/mysql-dump/wordpress_staging.sql:/docker-entrypoint-initdb.d/1_wordpress_staging.sql:ro
      - ./scripts/wordpress_staging_replacing.sql:/docker-entrypoint-initdb.d/2_wordpress_staging_replacing.sql:ro
    restart: always
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: geheim
      MYSQL_DATABASE: wordpress_staging
      MYSQL_USER: wordpressuser
      MYSQL_PASSWORD: geheim

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: phpmyadmin
    restart: always
    ports:
      - "8081:80"
    environment:
      PMA_HOST: db
      MYSQL_ROOT_PASSWORD: geheim
```

Der erste Docker Container **wordpress** ist natürlich für Wordpress. Mit dem volume wordpress_files persistiere ich die wordpress files.

Danach kommt der **db** Container welche eine MySQL Datenbank deployed. Wordpress verwendet MySQL als Datenbank zum Speichern von Informationen wie Blogposts, Sites, User, Pluginconfigs und noch vielen mehr. Das Volume db persistiert dabei die Datenbank. Die nächsten zwei Volumes speichern SQL Scripte im Container unter /docker-entrypoint-initdb.d :

```
- ./wordpress_files/wp-content/mysql-dump/wordpress_staging.sql:/docker-entrypoint-initdb.d/1_wordpress_staging.sql:ro
- ./scripts/wordpress_staging_replacing.sql:/docker-entrypoint-initdb.d/2_wordpress_staging_replacing.sql:ro
```

Dadurch werden die SQL Scripte beim ersten Start ausgeführt. Das erste Script wordpress_staging.sql beinhaltet die kompletten Wordpress MySQL Datenbank welche vorher als Dump exportiert wurde. Das zweite Script macht ein Text Replacing von der Domaine zu localhost:

```sql
UPDATE wp_options SET option_value = replace(option_value, 'https://www.example.com', 'http://localhost:8080') WHERE option_name = 'home' OR option_name = 'siteurl';
UPDATE wp_posts SET post_content = replace(post_content, 'https://www.example.com', 'http://localhost:8080');
UPDATE wp_postmeta SET meta_value = replace(meta_value,'https://www.example.com','http://localhost:8080');
```

Das ist nötig weil ich das Deployment ja lokal zum Laufen bekommen möchte.
# GitHub
Den Code also die Wordpress Files und das Docker Compose File nun zu einem GitHub Repository zu pushen ist ein leichtes. Dafür muss ja einfach nur ein neues GitHub Repository erstellt werden und die Dateien in dieses kopiert und gepusht werden.

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>