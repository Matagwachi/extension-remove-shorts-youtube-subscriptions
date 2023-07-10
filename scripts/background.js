chrome.tabs.onUpdated.addListener(function (tabId, tab) {
    if (tab.active && tab.url) {
        if (tab.url.includes('https://www.youtube.com/feed/subscriptions')) {
            // Exécutez votre fonction ici sur la page cible
            votreScript(tabId);
        }
    }
});

function votreScript(tabId) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: votreFonction,
    });
}

function votreFonction() {
    // Code de votre fonction à exécuter sur la page cible
    try {
        const balises = document.querySelectorAll("div.style-scope.ytd-rich-grid-media");

        var parentDivs = [];

        balises.forEach(function(element) {
          var parentDiv = element.closest("ytd-rich-item-renderer div.style-scope.ytd-rich-item-renderer");
          if (parentDiv && !parentDivs.includes(parentDiv)) {
            parentDivs.push(parentDiv);
          }
        });

        const balisesFiltrees = Array.from(parentDivs).filter(function (balise) {
            const balisesA = balise.getElementsByTagName('a'); // Récupérez toutes les balises <a> dans la balise <div>

            for (let i = 0; i < balisesA.length; i++) {
                const lien = balisesA[i].getAttribute('href'); // Obtenez la valeur de l'attribut href de chaque balise <a>
                console.log(lien)
                if (lien) {
                    if (lien.startsWith("/shorts")) { // Vérifiez si la valeur de l'attribut href commence par "/short:"
                    return true; // Si une balise <a> correspondante est trouvée, renvoyez true
                    }
                } 
            }

            return false; // Si aucune balise <a> correspondante n'est trouvée, renvoyez false
        });

        balisesFiltrees.forEach(function (balise) {
            balise.remove();
        });
    } catch (error) {
        console.log("Problème :", error);
    }
}