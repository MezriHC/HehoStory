(function() {
  // Récupère le script actuel
  const currentScript = document.currentScript;
  const widgetId = currentScript.getAttribute('data-widget-id');
  const containerId = `hehostory-widget-${widgetId}`;
  
  // Fonction pour charger le widget
  async function loadWidget() {
    try {
      // Récupère les données du widget
      const response = await fetch(`${currentScript.src.split('/widget.js')[0]}/api/widgets/${widgetId}`);
      const widget = await response.json();
      
      if (!widget) {
        console.error('Widget not found');
        return;
      }
      
      // Trouve le conteneur
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('Widget container not found');
        return;
      }
      
      // Applique les styles de base
      container.style.width = '100%';
      container.style.maxWidth = widget.settings?.maxWidth || '600px';
      container.style.margin = '0 auto';
      
      // Rend le widget (à adapter selon votre format d'affichage)
      container.innerHTML = `
        <div class="hehostory-widget" style="display: flex; gap: 10px; overflow-x: auto;">
          ${widget.stories.map(story => `
            <div class="hehostory-story" style="
              min-width: 100px;
              height: 150px;
              border-radius: 8px;
              background-image: url('${story.thumbnail}');
              background-size: cover;
              background-position: center;
              cursor: pointer;
            ">
              <div style="padding: 8px;">
                <h3 style="margin: 0; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.6);">
                  ${story.title}
                </h3>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      
      // Ajoute les événements click (à adapter selon vos besoins)
      container.querySelectorAll('.hehostory-story').forEach((storyElement, index) => {
        storyElement.addEventListener('click', () => {
          // Ouvrir la story dans une modal ou rediriger vers la page de la story
          window.open(`${currentScript.src.split('/widget.js')[0]}/story/${widget.stories[index].id}`, '_blank');
        });
      });
    } catch (error) {
      console.error('Error loading widget:', error);
    }
  }
  
  // Charge le widget quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }
})(); 