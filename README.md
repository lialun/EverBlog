# EverBlog
A three-row Ghost blog theme, inspired from Evernote.

## Demo:
[http://allan.li/](http://allan.li/)

## Source:
https://github.com/lialun/EverBlog

## Introduction:
### Chinese Introduction : [http://allan.li/everblog-theme/](http://allan.li/everblog-theme/)

## Advantage
1. Three rows layout,make information classification clear and accurate.
2. Small theme & Global AJAX request.
3. Dark or light theme toggle.
4. Mobile-Friendly.

## Usage:
0. download the last release version, and `Upload a theme` in Admin System-`Design`.
1. The pic in the top left corner is the `Publication logo`, upload in the Admin System-`General`, default size 70*70px.
2. Navigation list add in the Admin system-`Design`-`Navigation`.    
    You can add Tag URL which can be found in the Admin system-Tags, like "http://allan.li/tag/java/".    
    You can add Blog URL, like "http://allan.li/sql-common-resources/".    
    You can also add external URL, like "http://google.com/", it will open in new tab.
3. Open mainpage will auto load "/welcome/" blog, if don't have that blog right area will leave blank.You can change the default open blog URL in /partials/config.hbs.
4. Code highlighting plugin is Prism, support supports: css, js, bash, c, c++, c#, go, php, python, sql, groovy, http. To highlight, use markdown code-block (three ticks) and the language name: (```javascript)