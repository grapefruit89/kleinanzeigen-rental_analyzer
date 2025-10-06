# Kleinanzeigen Rental Analyzer Userscript

Dieses Repository stellt ein TemperMonkey-Userscript bereit, das Mietangebote auf Kleinanzeigen.de analysiert und den Mietpreis pro Quadratmeter hervorhebt.

## Installation
1. Installiere die Browsererweiterung [Tampermonkey](https://www.tampermonkey.net/).
2. Öffne das Dashboard von Tampermonkey und wähle **Neues Skript hinzufügen**.
3. Kopiere den Inhalt der Datei [`userscripts/kleinanzeigen-rental-analyzer.user.js`](userscripts/kleinanzeigen-rental-analyzer.user.js) in den Editor und speichere das Skript.

## Ausführung
1. Aktiviere das Skript im Tampermonkey-Dashboard, falls es nicht automatisch aktiv ist.
2. Rufe anschließend eine Immobilienanzeige auf [kleinanzeigen.de](https://www.kleinanzeigen.de/) auf.
3. Sobald Preis- und Flächenangaben erkannt werden, blendet das Skript oberhalb des Angebots einen Hinweis mit der berechneten Miete pro Quadratmeter ein.
4. Wechsle zwischen Anzeigen oder scrolle die Seite – das Skript reagiert automatisch auf Inhalte, die dynamisch nachgeladen werden.

## Funktionsumfang
- Identifiziert Preis- und Flächenangaben auf Angebotsseiten von Kleinanzeigen.de.
- Berechnet automatisch die Miete pro Quadratmeter.
- Fügt einen hervorgehobenen Hinweis in die Seite ein, der Preis, Fläche und berechneten Wert anzeigt.
- Reagiert auf dynamische Seitenwechsel durch MutationObserver und History-API-Hooks.

## Weiterentwicklung
Anpassungen an den DOM-Selektoren oder zusätzliche Kennzahlen können jederzeit in der Userscript-Datei vorgenommen werden.

Weitere Hinweise zum Projekt befinden sich in [`REPO_MEMORY.md`](REPO_MEMORY.md).

## Veröffentlichung auf GitHub
Die hier vorgenommenen Änderungen liegen aktuell im lokalen Git-Repository. Um sie auf GitHub sichtbar zu machen, musst du sie
selbst pushen, zum Beispiel:

```bash
git push origin <dein-branch-name>
```

Ersetze `<dein-branch-name>` durch den Namen des gewünschten Remote-Branches.
