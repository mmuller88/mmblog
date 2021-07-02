---
title: Wordpress mit Docker
show: 'no'
date: '2021-07-03'
image: 'docker-wordpress.png'
tags: ['de', '2021', 'github', 'docker', 'wordpress'] #nofeed
engUrl: https://martinmueller.dev/wordpress-with-docker-eng
pruneLength: 50
---

Hi Leute!

Für meinen neusten Kunden habe ich ein tolles AWS Backend mit AWS AppSync und vielen tollen weiteren AWS Services gebaut. Nun stehe ich aber vor der spannende Aufgabe die AppSync bzw. GraphQL API in einem Wordpress Frontend aufrufbar zu machen. Ich habe schon viel über Wordpress gehört aber noch nie damit gearbeitet.

Auch wird dieses Wordpress auf [Raidbox.de](https://raidbox.de) gehostet was es etwas schwierig macht das Deployment direkt zu verwalten. Kommend aus der DevOps Welt will ich natürlich das Wordpress Deployment so angenehm und automatisiert wie möglich konfigurieren.

Drei Anforderungen wollte ich dabei vom dem Wordpress Deployment erfüllt haben. Erstens soll Wordpress lokal mit minimalem Aufwand ausführbar sein. Zweitens soll das Wordpress mit GitHub versioniert sein. Und drittens soll ein Synchronisation zwischen dem lokalen Wordpress und dem auf Raidbox gehosteten Wordpress stattfinden.

# Wordpress
Wordpress ist ein Content Management System (CMS). Es wurde entwickelt zum erstellen von Blogposts. Es hat sich aber stark weiterentwickelt und wird nicht mehr nur für Blogposts benutzt. Über sogenannte Plugins werden neue Feature zu Wordpress hinzugefügt. Solche Features können sein eine Bezahlfunktion. Wir selber verwenden [Digimember](https://digimember.de) zum Verwalten eines Abobezahlsystems.

# Wordpress mit Docker
Zur Lösung meines ersten Problems, also Wordpress lokal zum Laufen zu bekommen, habe ich mich dafür entschlossen Docker zu benutzen. Zum Glück war ich nicht der erste der das versucht bzw. erfolgreich geschafft hat. Es gibt viele gute Anleitungen im Internet wie ein Wordpress Deployment mit Docker aufsetzen kann. Zur Orchestrierung der Docker Container verwende ich Docker Compose und hier ist der Code:

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
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DB_PASSWORD: geheim
      WORDPRESS_HOME: 'http://localhost:8080'
      WORDPRESS_SITEURL: 'http://localhost:8080'

  db:
    image: mysql:5.7
    container_name: db
    volumes:
      - ./db_data:/var/lib/mysql
      - ./wordpress_files/wp-content/mysql-dump/wordpress.sql:/docker-entrypoint-initdb.d/1_wordpress.sql:ro
      - ./scripts/wordpress_replacing.sql:/docker-entrypoint-initdb.d/2_wordpress_replacing.sql:ro
    restart: always
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: geheim
      MYSQL_DATABASE: wordpress
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
- ./wordpress_files/wp-content/mysql-dump/wordpress.sql:/docker-entrypoint-initdb.d/1_wordpress.sql:ro
- ./scripts/wordpress_replacing.sql:/docker-entrypoint-initdb.d/2_wordpress_replacing.sql:ro
```

Dadurch werden die SQL Scripte beim ersten Start ausgeführt. Das erste Script wordpress.sql beinhaltet die kompletten Wordpress MySQL Datenbank welche vorher als Dump exportiert wurde. Das zweite Script macht ein Text Replacing von der Domaine zu localhost:

```sql
UPDATE wp_options SET option_value = replace(option_value, 'https://www.example.com', 'http://localhost:8080') WHERE option_name = 'home' OR option_name = 'siteurl';
UPDATE wp_posts SET post_content = replace(post_content, 'https://www.example.com', 'http://localhost:8080');
UPDATE wp_postmeta SET meta_value = replace(meta_value,'https://www.example.com','http://localhost:8080');
```

Das ist nötig weil ich das Deployment ja lokal zum Laufen bekommen möchte.

Der letzt Container phpmyadmin ist eine graphische Verwaltung für die MySQL DB.

# GitHub
Den Code also die Wordpress Files und das Docker Compose File nun zu einem GitHub Repository zu pushen ist ein leichtes. Dafür muss ja einfach nur ein neues GitHub Repository erstellt werden und die Dateien in dieses kopiert und gepusht werden.

# Nach Raidbox.de syncen
Wie Eingangs schon erwähnt, Raidbox.de ist unserer Hoster für Wordpress. Um nun die MySQL Datenbank und die Wordpress files dort zu aktualsieren habe ich mich für rsync in Kombination mit ssh entschieden. Dafür habe ich einen Workflow entwickelt:

1) `./scripts/syncWithStaging.sh` pushes your local wordpress_files/wp-content, then dumps the staging mydb and than pulls the wordpress/wp-content including the dump. If there are changes now that probably means someone changed something directly over raidbox. Inspect the changes! If they are ok git commit the current status!
2) run `docker-compose down && sudo rm -rf db_data && docker-compose up -d --build` and make your changes
3) run `./scripts/createMySqlDumpExport.sh` to export the local DB to mysql-dump-export
4) apply the mysql-dump-export/wordpress.sql to the wordpress with using raidbox phpmyadmin
5) run `./scripts/syncWithStaging.sh` for syncing / pushing the wp-content folder.

Dieser Sync Workflow wird eventuell noch geändert in Zukunft und die Anzahl der Schritte reduziert. So wie dieser jetzt gestaltet ist, lassen sich immer noch über den normalen, über Raidbox erreichbaren Wordpress Editor, z.B. Blogs hinzufügen. Diese neuen Blogposts gehen dann beim nächsten Sync Workflow nicht verloren. Nachfolgend zeige ich noch die verwendeten Scripts

## syncWithStaging.sh
```bash
#!/bin/bash

# push to remote
rsync -avzh --no-perms --no-owner --no-group -e "ssh -i ~/.ssh/example" ./wordpress_files/wp-content wp@b9emwoc.myraidbox.de:/home/wp/disk/wordpress

# create sql dump on raidbox.de
ssh -i ~/.ssh/example wp@b9emwoc.myraidbox.de "mkdir -p /home/wp/disk/wordpress/wp-content/mysql-dump && mysqldump -u wordpressuser --no-tablespaces --password=geheim wordpress > /home/wp/disk/wordpress/wp-content/mysql-dump/wordpress.sql"

# pull from remote
rsync -avzh --no-perms --no-owner --no-group -e "ssh -i ~/.ssh/example"  wp@b9emwoc.myraidbox.de:/home/wp/disk/wordpress/wp-content ./wordpress_files
```

Hier sieht man wie mittels rsync, ssh und einem private key (~/ssh/example) die wordpress files zuerst gepusht und dann gepullt werden. Zusätzlich wird noch die MySQL DB auf Raidbox gedumpt und mitgepullt

## createMySqlDumpExport.sh
```bash
#!/bin/bash

# mysql export sql
CONTAINER=$(docker ps -aqf "name=db")
docker exec $CONTAINER /usr/bin/mysqldump -u wordpressuser --no-tablespaces --password=geheim wordpress_staging > ./mysql-dump-export/wordpress.sql

# replacing http://localhost:8080 with https://www.example.com in the sql dump
sed -i s#http://localhost:8080#https://www.example.com#g ./mysql-dump-export/wordpress.sql
```

Dieses Script such nach dem MySQL Docker Container und erstellt einen DB dump. Anschließend werden die urls wieder zu den originalen url Namen umgeschrieben. Dieser Dump kann nun mit dem Wordpress auf Raidbox importiert werden. Üblicherweise passiert das mit PHP Admin in Raidbox.

# HTML als Code
Eine Sache die mich bei Wordpress sehr stört ist der Inline Editor für HTML und JavaScript Code. Im Vergleich zu z.B. Visual Studio Code bietet dieser null Funktionalität. Was ich als gerne hätte ist, dass die HTML und JavaScript Codeabschnitte im Wordpress über lokale Files gemacht werden kann.

Diese lokalen Files kann ich dann wie gewohnt mit meinem VS Code Editor bearbeiten und bekomme tolle Hilfestellungen wir Syntaxkorrektur, Syntaxhighlighting und viele mehr. Das habe ich erreicht indem ich das HTML und JavaScript in iFrames, welche auf die Files pointen:

```html
<iframe src="/wp-content/themes/Impreza/get-vms.html">
```

Ein Problem hat das Ganze aber wahrscheinlich noch. Es ist nicht Skalierbar bzw. Responsive wenn sich die größe des Bildschirms ändert weil man z.B. die Wordpress Seite mit einem Handy besucht.

# Zusammenfassung
Wordpress ist eine interessante neue Erfahrung für mich. Ich mag den Wordpresseditor welcher ein graphisches Bauen der Webside ermöglicht. Allerdings habe ich viele out of the box DevOps Techniken vermisst. Macht aber nix mit den hier beschriebenen Ansätzen macht die Entwicklung mit Wordpress wesentlich mehr Spaß.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>