import { pageMeta, searchSections } from '../data/course'

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 54
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

const winAnsi = {
  À: 192,
  Á: 193,
  Â: 194,
  Ã: 195,
  Ä: 196,
  Å: 197,
  Æ: 198,
  Ç: 199,
  È: 200,
  É: 201,
  Ê: 202,
  Ë: 203,
  Ì: 204,
  Í: 205,
  Î: 206,
  Ï: 207,
  Ñ: 209,
  Ò: 210,
  Ó: 211,
  Ô: 212,
  Õ: 213,
  Ö: 214,
  Ù: 217,
  Ú: 218,
  Û: 219,
  Ü: 220,
  Ý: 221,
  à: 224,
  á: 225,
  â: 226,
  ã: 227,
  ä: 228,
  å: 229,
  æ: 230,
  ç: 231,
  è: 232,
  é: 233,
  ê: 234,
  ë: 235,
  ì: 236,
  í: 237,
  î: 238,
  ï: 239,
  ñ: 241,
  ò: 242,
  ó: 243,
  ô: 244,
  õ: 245,
  ö: 246,
  ù: 249,
  ú: 250,
  û: 251,
  ü: 252,
  ý: 253,
  ÿ: 255,
  Œ: 140,
  œ: 156,
  '€': 128,
  '’': 146,
  '‘': 145,
  '“': 147,
  '”': 148,
  '…': 133,
  '–': 150,
  '—': 151,
  '•': 149,
}

function byteFor(char) {
  const code = char.charCodeAt(0)
  if (code >= 32 && code <= 126) return code
  return winAnsi[char] ?? 63
}

function pdfString(text) {
  const bytes = [...String(text)].map(byteFor)

  return `(${bytes
    .map((byte) => {
      if (byte === 40 || byte === 41 || byte === 92) return `\\${String.fromCharCode(byte)}`
      if (byte >= 32 && byte <= 126) return String.fromCharCode(byte)
      return `\\${byte.toString(8).padStart(3, '0')}`
    })
    .join('')})`
}

function wrapText(text, size, maxWidth = CONTENT_WIDTH) {
  const words = String(text).replace(/\s+/g, ' ').trim().split(' ')
  const maxChars = Math.max(24, Math.floor(maxWidth / (size * 0.52)))
  const lines = []
  let line = ''

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > maxChars && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  })

  if (line) lines.push(line)
  return lines
}

function createPdfBuilder() {
  const pages = []
  let commands = []
  let y = PAGE_HEIGHT - MARGIN

  const newPage = () => {
    if (commands.length) pages.push(commands.join('\n'))
    commands = []
    y = PAGE_HEIGHT - MARGIN
  }

  const color = (r, g, b) => `${r} ${g} ${b} rg`

  const line = (x1, y1, x2, y2, r = 0.78, g = 0.82, b = 0.87) => {
    commands.push(`${r} ${g} ${b} RG ${x1} ${y1} m ${x2} ${y2} l S`)
  }

  const rect = (x, rectY, w, h, r, g, b) => {
    commands.push(`${color(r, g, b)} ${x} ${rectY} ${w} ${h} re f`)
  }

  const addText = (text, options = {}) => {
    const {
      size = 11,
      x = MARGIN,
      gap = size * 1.45,
      font = 'F1',
      maxWidth = CONTENT_WIDTH,
      r = 0.08,
      g = 0.13,
      b = 0.2,
      before = 0,
      after = 0,
    } = options

    y -= before

    wrapText(text, size, maxWidth).forEach((textLine) => {
      if (y < MARGIN + gap) newPage()
      commands.push(`BT /${font} ${size} Tf ${color(r, g, b)} 1 0 0 1 ${x} ${y} Tm ${pdfString(textLine)} Tj ET`)
      y -= gap
    })

    y -= after
  }

  const addHeading = (text) => {
    addText(text, { size: 17, font: 'F2', before: 18, after: 8, r: 0.03, g: 0.1, b: 0.22 })
  }

  const addSmall = (text) => {
    addText(text, { size: 9, r: 0.34, g: 0.4, b: 0.49 })
  }

  const finish = () => {
    if (commands.length) pages.push(commands.join('\n'))
    return buildPdf(pages)
  }

  return { addHeading, addSmall, addText, finish, line, newPage, rect }
}

function buildPdf(pageStreams) {
  const objects = []
  const add = (value) => {
    objects.push(value)
    return objects.length
  }

  const fontRegular = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
  const fontBold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')
  const pageRefs = []

  pageStreams.forEach((stream) => {
    const content = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
    const page = add(
      `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> /Contents ${content} 0 R >>`,
    )
    pageRefs.push(page)
  })

  const pages = add(`<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(' ')}] /Count ${pageRefs.length} >>`)
  const catalog = add(`<< /Type /Catalog /Pages ${pages} 0 R >>`)
  const finalObjects = objects.map((object) => object.replace('/Parent 0 0 R', `/Parent ${pages} 0 R`))

  let output = '%PDF-1.4\n'
  const offsets = [0]

  finalObjects.forEach((object, index) => {
    offsets.push(output.length)
    output += `${index + 1} 0 obj\n${object}\nendobj\n`
  })

  const xref = output.length
  output += `xref\n0 ${finalObjects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => {
    output += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  output += `trailer\n<< /Size ${finalObjects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`

  return output
}

function downloadPdf(content, filename) {
  const blob = new Blob([content], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function generateCoursePdf() {
  const pdf = createPdfBuilder()

  pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 0.96, 0.98, 1)
  pdf.rect(0, PAGE_HEIGHT - 14, PAGE_WIDTH, 14, 0.96, 0.78, 0.29)
  pdf.addText('Support de cours', { size: 12, font: 'F2', before: 70, r: 0.6, g: 0.41, b: 0 })
  pdf.addText('Entrepreneuriat', { size: 34, font: 'F2', after: 16, r: 0.03, g: 0.1, b: 0.22 })
  pdf.addText(
    "Synthèse générale : fondements, environnement de l'entreprise, processus de création et Business Plan.",
    { size: 13, maxWidth: 420, after: 34, r: 0.27, g: 0.33, b: 0.4 },
  )
  pdf.line(MARGIN, 505, PAGE_WIDTH - MARGIN, 505, 0.96, 0.78, 0.29)
  pdf.addText('Préparé pour : JEAN-MARC VERBECK', { size: 13, font: 'F2', before: 54 })
  pdf.addText('Date : 08 mai 2026', { size: 12 })
  pdf.addText("Institution : Institut Supérieur d'Entrepreneuriat", { size: 12 })
  pdf.addText('Référence : EA-COURS-2026', { size: 12, after: 28 })
  pdf.addHeading('Sommaire')
  Object.entries(pageMeta)
    .filter(([id]) => id !== 'certificat')
    .forEach(([, meta]) => pdf.addText(`${meta.label} - ${meta.title}`, { size: 11 }))

  Object.entries(pageMeta)
    .filter(([id]) => id !== 'certificat')
    .forEach(([pageId, meta]) => {
      pdf.newPage()
      pdf.addText(meta.label, { size: 10, font: 'F2', r: 0.6, g: 0.41, b: 0 })
      pdf.addText(meta.title, { size: 23, font: 'F2', after: 8, r: 0.03, g: 0.1, b: 0.22 })
      pdf.addText(meta.subtitle, { size: 12, after: 16, r: 0.27, g: 0.33, b: 0.4 })
      pdf.line(MARGIN, 684, PAGE_WIDTH - MARGIN, 684)

      searchSections
        .filter((section) => section.pageId === pageId)
        .forEach((section) => {
          pdf.addHeading(section.title)
          pdf.addText(section.text, { size: 11.5, after: 4, r: 0.1, g: 0.13, b: 0.16 })
        })
    })

  downloadPdf(pdf.finish(), 'entrepreneuriat-jean-marc-verbeck.pdf')
}

export function generateCertificatePdf() {
  const pdf = createPdfBuilder()

  pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 1, 1, 1)
  pdf.rect(0, PAGE_HEIGHT - 16, PAGE_WIDTH, 16, 0.96, 0.78, 0.29)
  pdf.addText('Certificat de réussite', { size: 14, font: 'F2', before: 96, r: 0.6, g: 0.41, b: 0 })
  pdf.addText('Entrepreneuriat', { size: 32, font: 'F2', after: 24, r: 0.03, g: 0.1, b: 0.22 })
  pdf.addText('Décerné à', { size: 12, r: 0.34, g: 0.4, b: 0.49 })
  pdf.addText('JEAN-MARC VERBECK', { size: 30, font: 'F2', after: 22, r: 0.03, g: 0.1, b: 0.22 })
  pdf.addText(
    "Ce certificat atteste la validation du parcours de synthèse en entrepreneuriat : fondements, environnement de l'entreprise, processus de création et Business Plan.",
    { size: 12.5, maxWidth: 430, after: 34, r: 0.18, g: 0.22, b: 0.27 },
  )
  pdf.line(MARGIN, 310, PAGE_WIDTH - MARGIN, 310, 0.96, 0.78, 0.29)
  pdf.addText('Date : 08 mai 2026', { size: 12, font: 'F2', before: 42 })
  pdf.addText('Référence : EA-JMV-2026-0508', { size: 12, font: 'F2' })
  pdf.addText("Institut Supérieur d'Entrepreneuriat", { size: 12, font: 'F2', after: 32 })
  pdf.addSmall('Direction académique')

  downloadPdf(pdf.finish(), 'certificat-jean-marc-verbeck.pdf')
}
