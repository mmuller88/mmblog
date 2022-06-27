---
title: Wordpress with Docker
date: '2021-07-03'
image: 'docker-wordpress.png'
tags: ['eng', '2021', 'github', 'docker', 'wordpress'] #nofeed
gerUrl: https://martinmueller.dev/wordpress-with-docker
pruneLength: 50
---

Hi guys!

For my newest customer I built a great AWS backend with AWS AppSync and many other great AWS services. But now I'm faced with the exciting task of making the AppSync or GraphQL API callable in a Wordpress frontend. I have heard a lot about wordpress but never worked with it.

Also, this wordpress is hosted on [Raidbox.de](https://raidbox.de) which makes it a bit difficult to manage the deployment directly. Coming from the DevOps world I want to configure the Wordpress deployment as comfortable and automated as possible.

I wanted three requirements to be met by the Wordpress deployment. First, Wordpress should be executable locally with minimal effort. Second, the Wordpress should be versioned with GitHub. And third, there should be a synchronization between the local wordpress and the wordpress hosted on Raidbox.

# Wordpress
Wordpress is a content management system (CMS). It was developed to create blogposts. But it has developed a lot and is not only used for blogposts anymore. About so-called plugins new features are added to Wordpress. Such features can be a payment function. We ourselves use [Digimember](https://digimember.de) to manage a subscription payment system.

# Wordpress with Docker
To solve my first problem, i.e. getting Wordpress to work locally, I decided to use Docker. Fortunately I was not the first one who tried or succeeded to do this. There are many good tutorials on the internet on how to set up a wordpress deployment with Docker. To orchestrate the Docker containers I use Docker Compose and here is the code:

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

The first Docker container **wordpress** is of course for wordpress. With the volume wordpress_files I persist the wordpress files.

After that comes the **db** container which deploys a MySQL database. Wordpress uses MySQL as database to store information like blogposts, sites, users, pluginconfigs and much more. The volume db persists the database. The next two volumes store SQL scripts in the container at /docker-entrypoint-initdb.d :

```
- ./wordpress_files/wp-content/mysql-dump/wordpress.sql:/docker-entrypoint-initdb.d/1_wordpress.sql:ro
- ./scripts/wordpress_replacing.sql:/docker-entrypoint-initdb.d/2_wordpress_replacing.sql:ro
```

This will execute the SQL scripts on first startup. The first script wordpress.sql contains the complete Wordpress MySQL database which was previously exported as a dump. The second script does a text replacing from the domain to localhost:

```sql
UPDATE wp_options SET option_value = replace(option_value, 'https://www.example.com', 'http://localhost:8080') WHERE option_name = 'home' OR option_name = 'siteurl';
UPDATE wp_posts SET post_content = replace(post_content, 'https://www.example.com', 'http://localhost:8080');
UPDATE wp_postmeta SET meta_value = replace(meta_value,'https://www.example.com','http://localhost:8080');
```

This is necessary because I want to get the deployment working locally.

The last container phpmyadmin is a graphical administration for the MySQL DB.

# GitHub
Pushing the code, the Wordpress files and the Docker Compose file to a GitHub repository is easy. Just create a new GitHub repository and copy and push the files to it.

# Sync to Raidbox.de
As mentioned before, Raidbox.de is our hoster for Wordpress. To update the MySQL database and the Wordpress files there I decided to use rsync in combination with ssh. For this I have developed a workflow:

1) `./scripts/syncWithStaging.sh` pushes your local wordpress_files/wp-content, then dumps the staging mydb and then pulls the wordpress/wp-content including the dump. If there are changes now that probably means someone changed something directly over raidbox. Inspect the changes! If they are ok git commit the current status!
2) run `docker-compose down && sudo rm -rf db_data && docker-compose up -d --build` and make your changes
3) run `./scripts/createMySqlDumpExport.sh` to export the local DB to mysql-dump-export
4) apply the mysql-dump-export/wordpress.sql to the wordpress with using raidbox phpmyadmin
5) run `./scripts/syncWithStaging.sh` for syncing / pushing the wp-content folder.

This sync workflow may be changed in the future and the number of steps reduced. As it is designed now, you can still add e.g. blogs via the normal wordpress editor accessible via Raidbox. These new blogposts will then not be lost in the next sync workflow. In the following I show the used scripts

## syncWithStaging.sh
```bash
#!/bin/bash

# push to remote
rsync -avzh --no-perms --no-owner --no-group -e "ssh -i ~/.ssh/example" ./wordpress_files/wp-content wp@b9emwoc.myraidbox.de:/home/wp/disk/wordpress

# create sql dump on raidbox.de
ssh -i ~/.ssh/example wp@b9emwoc.myraidbox.de "mkdir -p /home/wp/disk/wordpress/wp-content/mysql-dump && mysqldump -u wordpressuser --no-tablespaces --password=secret wordpress > /home/wp/disk/wordpress/wp-content/mysql-dump/wordpress.sql"

# pull from remote
rsync -avzh --no-perms --no-owner --no-group -e "ssh -i ~/.ssh/example" wp@b9emwoc.myraidbox.de:/home/wp/disk/wordpress/wp-content ./wordpress_files
```

Here you can see how with rsync, ssh and a private key (~/ssh/example) the wordpress files are first pushed and then pulled. Additionally the MySQL DB is dumped to Raidbox and pulled as well.

## createMySqlDumpExport.sh
```bash
#!/bin/bash

# mysql export sql
CONTAINER=$(docker ps -aqf "name=db")
docker exec $CONTAINER /usr/bin/mysqldump -u wordpressuser --no-tablespaces --password=secret wordpress_staging > ./mysql-dump-export/wordpress.sql

# replacing http://localhost:8080 with https://www.example.com in the sql dump
sed -i s#http://localhost:8080#https://www.example.com#g ./mysql-dump-export/wordpress.sql
```

This script searches for the MySQL Docker container and creates a DB dump. Afterwards the urls are rewritten to the original url names. This dump can now be imported with the wordpress on Raidbox. Usually this is done with PHP Admin in Raidbox.

# HTML as code
One thing that bothers me a lot with Wordpress is the inline editor for HTML and JavaScript code. Compared to e.g. Visual Studio Code it offers zero functionality. What I would like is that the HTML and JavaScript code sections in Wordpress can be done via local files.

I can then edit these local files as usual with my VS code editor and get great help like syntax correction, syntax highlighting and many more. I did this by converting the HTML and JavaScript into iFrames, which point to the files:

``html
<iframe src="/wp-content/themes/Impreza/get-vms.html" />
```

But the whole thing probably still has one problem. It is not scalable or responsive when the size of the screen changes because you visit the wordpress site with a cell phone for example.

# Summary
Wordpress is an interesting new experience for me. I like the wordpress editor which allows a graphical building of the website. However, I missed many out of the box DevOps techniques. But that doesn't matter with the approaches described here, development with Wordpress is much more fun.

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>