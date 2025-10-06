# Repository Memory

## Inhaltsverzeichnis
- [Zweck](#zweck)
- [Struktur](#struktur)
- [Offene Fragen](#offene-fragen)

## Zweck
Dieses Projekt enthält ein TemperMonkey-Userscript, das Mietinserate auf Kleinanzeigen.de analysiert und den Mietpreis pro Quadratmeter hervorhebt.

## Struktur
- `userscripts/` – Enthält das Userscript `kleinanzeigen-rental-analyzer.user.js`, welches den Analyse-Overlay direkt im Browser einfügt.
- `README.md` – Allgemeine Projektbeschreibung und Installationshinweise.
- `REPO_MEMORY.md` – Diese Gedächtnisdatei mit Überblick über Zweck und Struktur des Repositories.

## Offene Fragen
- Eine genauere Abstimmung der DOM-Selektoren kann nötig sein, sobald reale Layout-Varianten der Seite bekannt sind.
- Eventuelle Erweiterungen könnten Vergleichswerte oder Marktstatistiken integrieren.
