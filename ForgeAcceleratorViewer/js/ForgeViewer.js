var viewer;

function launchViewer(urn) {
    var options = {
        env: 'AutodeskProduction',
        getAccessToken: getForgeToken
    };

    Autodesk.Viewing.Initializer(options, () => {
        viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['Autodesk.DocumentBrowser'] });
        viewer.start();
        viewer.loadExtension('IconMarkupExtension', {
            button: {
                icon: 'fa-thermometer-half',
                tooltip: 'Show Temperature'
            },
            icons: [
                { dbId: 3944, label: '300&#176;C', css: 'fas fa-thermometer-full' },
                { dbId: 721, label: '356&#176;C', css: 'fas fa-thermometer-full' },
                { dbId: 10312, label: '450&#176;C', css: 'fas fa-thermometer-empty' },
                { dbId: 563, css: 'fas fa-exclamation-triangle' },
            ],
            onClick: (id) => {
                viewers.select(id);
                viewers.utilities.fitToView();
                switch (id) {
                    case 563:
                        alert('Sensor offline');
                }
            }
        })
        var documentId = 'urn:' + urn;
        Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}

function onDocumentLoadSuccess(doc) {
    var viewables = doc.getRoot().getDefaultGeometry();
    viewer.loadDocumentNode(doc, viewables).then(i => {
        // documented loaded, any action?
    });
}

function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
    fetch('/api/forge/oauth/token').then(res => {
        res.json().then(data => {
            callback(data.access_token, data.expires_in);
        });
    });
}
