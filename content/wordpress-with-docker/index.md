---
title: Wordpress mit Docker rules
show: 'no'
date: '2021-06-27'
# image: 'version-prs.png'
tags: ['de', '2021', 'github', 'docker'] #nofeed
engUrl: https://martinmueller.dev/wordpress-with-docker-eng
pruneLength: 50
---

Hi Leute!

* für neuen Kunden AWS Backend gesteuert von Wordpress
* Hatte null Erfahrung mit Wordpress
* Wordpress wird gehostet auf Raidbox.de
* Zwei Probleme alt es zu lösen. 1) Ich wollte Wordpress lokal zum Laufen bekommen 2) Es wäre cool wenn es versioniert wäre mit GitHub

# Wordpress
Wordpress ist ein Content Managment System (CMS). Es wurde entwickelt zum erstellen von Blogposts. Es hat sich aber extrem stark weiterentwickelt und wird nicht mehr nur für Blogposts benutzt. Über sogenannte Plugins werden neue Feature zu Wordpress hinzugefügt. Solche Features können sein eine Paymentfunktion. Wir selber verwenden [digimember](https://digimember.de) zum Verwalten eines Abobezahlsystems.

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


# GitHub
Den Code also die Wordpress Files und das Docker Compose File nun zu einem GitHub Repository zu pushen ist ein leichtes. Dafür muss ja einfach nur ein neues GitHub Repository erstellt werden und die Dateien in dieses kopiert und gepusht werden.

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>