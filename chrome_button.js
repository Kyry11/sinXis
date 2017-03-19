(function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://raw.githubusercontent.com/Kyry11/sinXis/master/main.js", false);
    xhr.send(null);
    var code = xhr.responseText;
    var dScript = document.createElement('script');
    try {
        dScript.appendChild(document.createTextNode(code));
        document.body.appendChild(dScript);
    } catch (e) {
        dScript.text = code;
        document.getElementsByTagName('head')[0].appendChild(dScript);
    }
    xhr = null;
})();