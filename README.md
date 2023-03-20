# SFI verb app
A Swedish verb revision tool, built specifically for the SFI (Svenskundervisning för invandrare) level C/D course.

It's built responsively, mobile first, and as we progress will get a bit more functionality and a lot more design work for different screensizes.

It's build with json/Angular 1.x to:
- allow quick updates to the data (ie, add more verbs in - it's just some irregular ones currently)
- manipulate/sort/filter
- allow me to extend the data model later with translations, meta info, etc
- allow me to explore Angular alternatives, against a simple Angular baseline.

It's also built with grunt and assemble.

It's going to be built pretty iteratively, so it's starting as little more than a filtered list, and I'll add functionality as I find I need it to do more stuff.

## View it live:

[https://pixelthing.github.io/svenska-verb/dist/](https://pixelthing.github.io/svenska-verb/dist/)

## Background
Scratching my own itch. I was fed up with photocopied A4, or apps that never quite fitted my use-case. But on top of that, I realised my brain hasn't been wired for school-structured learning for decades, so felt the best way to try and learn was to do what I enjoy doing, what I'm good at doing, which was understanding a problem and applying it to a UX problem. Hopefully some of the verb conjugations will rub off along the way, and if it doesn't help, at least I'll have a better revision tool.

Lastly, it seemed that a good route to exploring new technologies like offline (serviceworker), manifest, and Angular alternatives, was to build a small app that actually had a reason to exist (rather than another hello-world-todo-list example).
