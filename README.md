# EverBlog
A three rows layout ghost blog theme

##Demo:
[http://allan.li/](http://allan.li/)

##Source:
https://github.com/lialun/EverBlog

##Introduction:
### Chinese Introduction : [http://allan.li/everblog-theme/](http://allan.li/everblog-theme/)
##Advantage
1. three rows layout,information classification clear and accurate.
2. small themes, load very fast.
3. global ajax request, response fast.
4. dark and light theme change,not dazzling in the night.
5. adaptate mobile phone.

##Usage:
1. The pic in the top left corner is the Blog Logo, upload in the Admin System-General, default size 70*70px.
2. Navigation list add in the Admin system-Navigation.    
    You can add Tag URL which can be found in the Admin system-Tags,like "http://allan.li/tag/java/".    
    You can add Blog URL ,like "http://allan.li/sql-common-resources/".    
    You can also add external URL ,like "http://google.com/",it will open in new tab.
3. Change Post per page much bigger(like 15),or auto load next page will be fail.
4. The blog which will auto load in the index page, is set in /partials/config.hbs,the default_post param.or leave blank will not auto load blog.
5. Highlight plugin is Prism, support css£¬js£¬bash£¬c£¬c++£¬c#£¬go£¬php£¬python£¬sql£¬groovy£¬http.when need highlight,just add \`\`\` and the language name,like \`\`\`java.