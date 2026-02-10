// LTeX: SETTINGS enabled=false

#let arkheion(
  title: "",
  abstract: none,
  keywords: (),
  authors: (),
  custom-authors: none,
  date: none,
  body,
) = {
  // Set the document's basic properties.
  set document(author: authors.map(a => a.name), title: title)

  import "@preview/hydra:0.6.2": anchor, hydra

  set page(
    margin: (left: 31.7mm, right: 31.7mm, top: 25.4mm, bottom: 25.4mm),
  )

  set text(font: "Arimo Nerd Font", size: 12pt, lang: "es", hyphenate: false)
  set par(justify: true)
  show math.equation: set text(weight: 400)
  show math.equation: set block(spacing: 0.65em)
  set math.equation(numbering: "(1)")
  set heading(numbering: "1.1")

  // Set run-in subheadings, starting at level 4.
  show heading: it => {
    // H1 and H2
    if it.level == 1 {
      pad(
        bottom: 10pt,
        it,
      )
    } else if it.level == 2 {
      pad(
        bottom: 8pt,
        it,
      )
    } else if it.level > 3 {
      text(11pt, weight: "bold", it.body + " ")
    } else {
      it
    }
  }

  line(length: 100%, stroke: 2pt)
  // Title row.
  pad(
    bottom: 4pt,
    top: 4pt,
    align(center)[
      #block(text(weight: 500, 1.55em, title))
      #v(1em, weak: true)
    ],
  )
  line(length: 100%, stroke: 2pt)

  // Author information.
  pad(
    top: 0.5em,
    x: 2em,
    {
      // 1. Primero preparamos el diseño de CADA autor y lo guardamos en una lista
      let author-boxes = authors.map(author => align(center)[
        #if author.keys().contains("orcid") {
          link("http://orcid.org/" + author.orcid)[
            #pad(
              bottom: -8pt,
              grid(
                columns: (8pt, auto, 8pt),
                rows: 10pt,
                [],
                [*#author.name*],
                [
                  #pad(left: 4pt, top: -4pt, image("orcid.svg", width: 8pt))
                ],
              ),
            )
          ]
        } else {
          grid(
            columns: 2,
            rows: 2pt,
            [*#author.name*],
          )
        }
        // Corrección de seguridad para email y afiliación
        #link(author.at("email", default: ""))
        #if "affiliation" in author [
          \ #author.affiliation
        ]
      ])

      // 2. Lógica de visualización: Caso especial para 3 autores
      if authors.len() == 3 {
        // Primera fila: 2 autores
        grid(
          columns: (1fr, 1fr),
          gutter: 1em,
          author-boxes.at(0),
          author-boxes.at(1)
        )
        v(1em) // Espacio vertical entre filas
        // Segunda fila: 1 autor centrado
        align(center, author-boxes.at(2))

      } else {
        // Caso normal (automático para 1, 2, 4+ autores)
        grid(
          columns: (1fr,) * calc.min(3, authors.len()),
          gutter: 1em,
          ..author-boxes
        )
      }
    }
  )
  // line(length: 0%, stroke: 2pt) // espacio vertical

  align(center)[#date]

  // Abstract.
  /*pad(
    x: 3em,
    top: 1em,
    bottom: 0.4em,
    align(center)[
      #heading(
        outlined: false,
        numbering: none,
        text(0.85em, smallcaps[Abstract]),
      )
      #set par(justify: true)
      #set text(hyphenate: false)

      #abstract
    ],
  ) */

  // Keywords
  if keywords.len() > 0 {
    [*_Keywords_* #h(0.3cm)] + keywords.map(str).join(" · ")
  }
  // Main body.
  //set par(justify: true)
  //set text(hyphenate: false)

  body
}

#let arkheion-appendices(body) = {
  counter(heading).update(0)
  counter("appendices").update(1)

  set heading(
    numbering: (..nums) => {
      let vals = nums.pos()
      let value = "ABCDEFGHIJ".at(vals.at(0) - 1)
      if vals.len() == 1 {
        return "APPENDIX " + value
      } else {
        return value + "." + nums.pos().slice(1).map(str).join(".")
      }
    },
  )
  [#pagebreak() #body]
}
