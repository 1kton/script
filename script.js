function gerarApagamento() {
    try {
        const inputText = document.getElementById('input-apagamento').value.trim();
        const productIds = inputText.split('\n').map(id => id.trim()).filter(id => id);

        if (productIds.length === 0) {
            throw new Error("Por favor, insira pelo menos um ID.");
        }

        const now = new Date();
        const formattedDate = now.toLocaleString().replace(/[/:]/g, '-').replace(', ', '-');
        const fileName = `Apagamento-${formattedDate}.mjl`;

        let xmlContent = `<?xml version="1.0" ?>\n<marinaJobList version="3.0">\n\t<jobList>\n`;

        const mediaSets = [
            { Name: "ING1", DirectoryId: "136", Directory: "\\\\10.193.49.131\\fs0\\clip.dir" },
            { Name: "ING2", DirectoryId: "167", Directory: "\\\\10.193.49.132\\fs0\\clip.dir\\ " },
            { Name: "SVR1", DirectoryId: "137", Directory: "\\\\10.193.49.133\\fs0\\clip.dir" },
            { Name: "SVR2", DirectoryId: "138", Directory: "\\\\10.193.49.144\\fs0\\clip.dir" },
            { Name: "SVR4", DirectoryId: "162", Directory: "\\\\10.193.49.139\\fs0\\clip.dir" },
            { Name: "RJ", DirectoryId: "150", Directory: "\\\\10.193.48.194\\c$\\Geral\\RJ" },
            { Name: "MIDIAS DR", DirectoryId: "170", Directory: "\\\\10.193.48.194\\c$\\Geral\\MIDIAS DR" }
        ];

        productIds.forEach(id => {
            mediaSets.forEach(mediaSet => {
                xmlContent += `
    <job uid="-1" timerMarker="false" enabled="true" type="Delete">
        <properties>
            <media mediaName="${id}" mediaType="Video">
                <mediaInstances>
                    <mediaInstance mediaSetName="${mediaSet.Name}" directoryId="${mediaSet.DirectoryId}" directory="${mediaSet.Directory}"/>
                </mediaInstances>
            </media>
        </properties>
    </job>`;
            });
        });

        xmlContent += `\n\t</jobList>\n</marinaJobList>`;

        const blob = new Blob([xmlContent], { type: 'text/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        document.getElementById('success-apagamento').style.display = 'block';
        document.getElementById('error-apagamento').style.display = 'none';

    } catch (error) {
        document.getElementById('error-apagamento').innerText = error.message;
        document.getElementById('error-apagamento').style.display = 'block';
        document.getElementById('success-apagamento').style.display = 'none';
    }
}

function gerarLista() {
    try {
        const inputText = document.getElementById('input-geracao').value.trim();
        if (!inputText) {
            throw new Error("Por favor, insira pelo menos um ID.");
        }

        const linhas = inputText.split('\n');
        const now = new Date();
        const lista = now.toLocaleString().replace(/[/:]/g, '-').replace(', ', '-');
        const nomeArquivo = `Lista-${lista}.mpl`;

        let padrao = '<?xml version="1.0" encoding="UTF-8"?>\n<marinaPlaylist version="3.1">\n';
        let eventList = '<eventList>\n';

        linhas.forEach(function(linha) {
            eventList += `
<event>
<properties>
    <media mediaType="Video" mediaName="${linha.trim()}" />
</properties>
</event>`;
        });

        eventList += '</eventList>\n</marinaPlaylist>';
        padrao += eventList;

        const blob = new Blob([padrao], { type: 'text/xml' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = nomeArquivo;
        link.click();

        document.getElementById('success-geracao').style.display = 'block';
        document.getElementById('error-geracao').style.display = 'none';

    } catch (error) {
        document.getElementById('error-geracao').innerText = error.message;
        document.getElementById('error-geracao').style.display = 'block';
        document.getElementById('success-geracao').style.display = 'none';
    }
}