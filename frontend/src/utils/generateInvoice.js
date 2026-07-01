import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ── Palette ───────────────────────────────────────────────────
const DARK    = [15,  23,  42]
const GOLD    = [240, 156, 39]
const WHITE   = [255, 255, 255]
const LGRAY   = [248, 250, 252]
const GRAY    = [107, 114, 128]
const BORDER  = [226, 232, 240]
const INK     = [15,  23,  42]
const GREEN   = [22,  163, 74]
const RED     = [220, 38,  38]
const AMBER_L = [254, 243, 199]
const AMBER_D = [180, 83,  9]
const SLATE   = [148, 163, 184]

const ML = 14, MR = 14
const W  = 210
const CW = W - ML - MR   // 182mm

// ── Helpers ───────────────────────────────────────────────────

// T() always sets font+size+color before drawing — no stale state
function T(doc, text, x, y, { size = 8, weight = 'normal', color = INK, align = 'left' } = {}) {
  doc.setFont('helvetica', weight)
  doc.setFontSize(size)
  doc.setTextColor(...color)
  doc.text(String(text ?? '—'), x, y, { align })
}

function fillRect(doc, x, y, w, h, color) {
  doc.setFillColor(...color)
  doc.rect(x, y, w, h, 'F')
}

function strokeRect(doc, x, y, w, h, color, lw = 0.3) {
  doc.setDrawColor(...color)
  doc.setLineWidth(lw)
  doc.rect(x, y, w, h, 'S')
}

function hline(doc, x1, x2, y, color = BORDER, lw = 0.3) {
  doc.setDrawColor(...color)
  doc.setLineWidth(lw)
  doc.line(x1, y, x2, y)
}

function vline(doc, x, y1, y2, color = BORDER, lw = 0.3) {
  doc.setDrawColor(...color)
  doc.setLineWidth(lw)
  doc.line(x, y1, x, y2)
}

const fmtMoney = (n) => 'Rs ' + Number(n || 0).toLocaleString('en-PK', { minimumFractionDigits: 0 })
const fmtDate  = (s) => s ? new Date(s).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

async function loadImage(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const blob = await res.blob()
    if (blob.type.includes('svg')) return null
    const fmt = blob.type.includes('png') ? 'PNG' : 'JPEG'
    const data = await new Promise(resolve => {
      const r = new FileReader()
      r.onload = e => resolve(e.target.result)
      r.readAsDataURL(blob)
    })
    return { data, fmt }
  } catch { return null }
}

function safeAddImage(doc, img, x, y, w, h) {
  if (!img?.data) return false
  try { doc.addImage(img.data, img.fmt, x, y, w, h); return true } catch { return false }
}

// ── Main export ───────────────────────────────────────────────
export async function generateInvoicePDF(order) {
  const doc    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const PAGE_H = doc.internal.pageSize.getHeight()  // 297mm

  // Pre-load product images
  const imgCache = {}
  for (const item of order.items ?? []) {
    if (item.product_image) {
      const img = await loadImage(item.product_image)
      if (img) imgCache[item.id] = img
    }
  }

  const logo = await loadImage('/logo.png') ?? await loadImage('/logo.jpg')

  // ════════════════════════════════════════════════════════
  // SECTION 1 — DARK HEADER  (0 → 33mm)
  // ════════════════════════════════════════════════════════
  fillRect(doc, 0, 0, W, 33, DARK)

  const logoOk = safeAddImage(doc, logo, ML, 5, 34, 13)
  if (!logoOk) {
    T(doc, 'SELECTIONS.PK', ML, 14, { size: 14, weight: 'bold', color: GOLD })
  }

  T(doc, 'SELECTIONS.PK',              ML, 24, { size: 8.5, weight: 'bold',   color: GOLD  })
  T(doc, 'Premium Products · Pakistan', ML, 29, { size: 6,   weight: 'normal', color: SLATE })

  T(doc, 'www.selections.pk',                   W - MR, 10, { size: 7, color: SLATE, align: 'right' })
  T(doc, 'selectionspk.official@gmail.com',      W - MR, 17, { size: 7, color: SLATE, align: 'right' })
  T(doc, '+92 317 8968927  ·  Lahore, Pakistan', W - MR, 24, { size: 7, color: SLATE, align: 'right' })
  T(doc, 'INVOICE',                              W - MR, 31, { size: 10, weight: 'bold', color: GOLD, align: 'right' })

  fillRect(doc, 0, 33, W, 1.5, GOLD)

  let y = 38

  // ════════════════════════════════════════════════════════
  // SECTION 2 — ORDER META  (4 info columns)
  // ════════════════════════════════════════════════════════
  const META_H = 22
  fillRect(doc,   ML, y, CW, META_H, LGRAY)
  strokeRect(doc, ML, y, CW, META_H, BORDER)

  const colW = CW / 4
  ;[1, 2, 3].forEach(i => vline(doc, ML + colW * i, y + 2, y + META_H - 2))

  const STATUS_COLOR = {
    delivered: GREEN, confirmed: GREEN, shipped: [59, 130, 246],
    pending: AMBER_D, processing: [109, 40, 217], cancelled: RED, refunded: GRAY,
  }

  ;[
    ['ORDER #', `#${order.order_number ?? order.id}`, INK],
    ['DATE',    fmtDate(order.created_at),             INK],
    ['PAYMENT', order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online', INK],
    ['STATUS',  (order.status ?? '').toUpperCase(),    STATUS_COLOR[order.status] ?? GRAY],
  ].forEach(([label, value, color], i) => {
    const cx = ML + colW * i + colW / 2
    T(doc, label, cx, y + 7,  { size: 5.5, weight: 'bold',   color: GRAY, align: 'center' })
    T(doc, value, cx, y + 16, { size: 7.5, weight: 'bold',   color,       align: 'center' })
  })

  y += META_H + 5

  // ════════════════════════════════════════════════════════
  // SECTION 3 — BILLING + SHIPPING
  // ════════════════════════════════════════════════════════
  const BOX_W = (CW - 4) / 2
  const BOX_H = 37

  const buildAddr = (o) =>
    [o.shipping_address_line1, o.shipping_city, o.shipping_country]
      .filter(Boolean).join(', ') || '—'

  ;[
    {
      title: 'BILLING DETAILS',
      rows: [
        ['Customer', order.user_name    ?? '—'],
        ['Email',    order.user_email   ?? '—'],
        ['Phone',    order.shipping_phone ?? '—'],
      ],
    },
    {
      title: 'SHIPPING DETAILS',
      rows: [
        ['Recipient', order.shipping_full_name ?? order.user_name ?? '—'],
        ['Phone',     order.shipping_phone ?? '—'],
        ['Address',   buildAddr(order)],
        ...(order.tracking_number ? [['Tracking', order.tracking_number]] : []),
      ],
    },
  ].forEach(({ title, rows }, bi) => {
    const bx = ML + bi * (BOX_W + 4)
    strokeRect(doc, bx, y, BOX_W, BOX_H, BORDER)

    // Gold title bar
    fillRect(doc, bx, y, BOX_W, 9, GOLD)
    T(doc, title, bx + BOX_W / 2, y + 6.3, { size: 6, weight: 'bold', color: DARK, align: 'center' })

    let ry = y + 16
    rows.forEach(([label, value]) => {
      T(doc, label + ':', bx + 4, ry, { size: 6.5, weight: 'bold', color: GRAY })

      // Truncate long values to fit box
      const MAX_W = BOX_W - 26
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      let v = String(value ?? '—')
      while (v.length > 3 && doc.getTextWidth(v) > MAX_W) v = v.slice(0, -1)
      if (v !== String(value ?? '—')) v += '…'

      T(doc, v, bx + 25, ry, { size: 7, color: INK })
      ry += 5.8
    })
  })

  y += BOX_H + 4

  // ════════════════════════════════════════════════════════
  // SECTION 4 — PRODUCTS TABLE
  // ════════════════════════════════════════════════════════
  const IMG_SZ = 14

  autoTable(doc, {
    startY: y,
    head: [['', 'PRODUCT NAME', 'QTY', 'UNIT PRICE', 'TOTAL']],
    body: (order.items ?? []).map(item => [
      '',
      item.product_name ?? '—',
      item.quantity ?? 1,
      fmtMoney(item.unit_price),
      fmtMoney(item.line_total),
    ]),
    margin: { left: ML, right: MR },
    headStyles: {
      fillColor: DARK, textColor: WHITE, fontStyle: 'bold',
      fontSize: 6.5, halign: 'center',
      cellPadding: { top: 4, bottom: 4, left: 2, right: 2 },
    },
    bodyStyles: {
      fontSize: 7.5,
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
      textColor: INK, lineColor: BORDER, lineWidth: 0.25,
      minCellHeight: IMG_SZ + 4,
    },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 72 },
      2: { cellWidth: 12, halign: 'center' },
      3: { cellWidth: 36, halign: 'right' },
      4: { cellWidth: 36, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: { fillColor: LGRAY },
    didDrawCell(d) {
      if (d.section !== 'body' || d.column.index !== 0) return
      const item = (order.items ?? [])[d.row.index]
      if (!item) return
      const ix = d.cell.x + (d.cell.width - IMG_SZ) / 2
      const iy = d.cell.y + (d.cell.height - IMG_SZ) / 2
      if (!safeAddImage(doc, imgCache[item.id], ix, iy, IMG_SZ, IMG_SZ)) {
        fillRect(doc, ix, iy, IMG_SZ, IMG_SZ, LGRAY)
        T(doc, 'IMG', ix + IMG_SZ / 2, iy + IMG_SZ / 2 + 1.5,
          { size: 5.5, weight: 'bold', color: GRAY, align: 'center' })
      }
    },
  })

  y = doc.lastAutoTable.finalY + 5

  // ════════════════════════════════════════════════════════
  // SECTION 5 — TOTALS  (right-aligned block)
  // ════════════════════════════════════════════════════════
  const TBL_W = 84
  const TBL_X = W - MR - TBL_W

  const sub   = Number(order.subtotal        || 0)
  const ship  = Number(order.shipping_cost   || 0)
  const disc  = Number(order.discount_amount || 0)
  const grand = Number(order.total           || sub - disc)

  const totRows = [
    ['Subtotal', fmtMoney(sub), INK, false],
    ...(disc > 0 ? [[`Discount${order.coupon_code ? ` (${order.coupon_code})` : ''}`, `- ${fmtMoney(disc)}`, RED, false]] : []),
    ['Shipping', ship === 0 ? 'FREE' : fmtMoney(ship), ship === 0 ? GREEN : INK, false],
    ['GRAND TOTAL', fmtMoney(grand), GOLD, true],
  ]

  let ty = y
  totRows.forEach(([label, value, valueColor, isGrand]) => {
    const rh = isGrand ? 10 : 7.5
    if (isGrand) {
      fillRect(doc, TBL_X, ty, TBL_W, rh, DARK)
      T(doc, label, TBL_X + 5,        ty + 7,  { size: 8,  weight: 'bold', color: WHITE })
      T(doc, value, TBL_X + TBL_W - 5, ty + 7,  { size: 9,  weight: 'bold', color: GOLD,  align: 'right' })
    } else {
      hline(doc, TBL_X, TBL_X + TBL_W, ty, BORDER)
      T(doc, label, TBL_X + 5,        ty + 5.5, { size: 7.5, color: GRAY })
      T(doc, value, TBL_X + TBL_W - 5, ty + 5.5, { size: 7.5, weight: 'bold', color: valueColor, align: 'right' })
    }
    ty += rh
  })

  y = ty + 5

  // ════════════════════════════════════════════════════════
  // SECTION 6 — COD NOTE
  // ════════════════════════════════════════════════════════
  if (order.payment_method === 'cod') {
    fillRect(doc,   ML, y, CW, 14, AMBER_L)
    strokeRect(doc, ML, y, CW, 14, [252, 211, 77])
    fillRect(doc,   ML, y,  3, 14, GOLD)

    T(doc, 'COD NOTE:', ML + 7,  y + 6,  { size: 7, weight: 'bold', color: AMBER_D })
    T(doc, `Pay ${fmtMoney(grand)} to rider at delivery. Check items before paying.`,
           ML + 28, y + 6,  { size: 7, color: AMBER_D })
    T(doc, 'Contact us within 7 days for any issue.',
           ML + 7,  y + 11, { size: 6, color: [120, 70, 0] })

    y += 18
  }

  // ════════════════════════════════════════════════════════
  // SECTION 7 — BENEFITS  (3 columns)
  // ════════════════════════════════════════════════════════
  hline(doc, ML, W - MR, y, BORDER)

  const benW = CW / 3
  ;['Free Delivery on All Orders', '7-Day Easy Returns', '100% Secure Shopping'].forEach((txt, i) => {
    if (i > 0) vline(doc, ML + benW * i, y + 2, y + 13)
    T(doc, txt, ML + benW * i + benW / 2, y + 9, { size: 6.5, color: GRAY, align: 'center' })
  })

  hline(doc, ML, W - MR, y + 14, BORDER)

  // ════════════════════════════════════════════════════════
  // SECTION 8 — THANK YOU + FOOTER  (pinned to page bottom)
  // ════════════════════════════════════════════════════════
  const FOOTER_H = 24
  const FOOTER_Y = PAGE_H - FOOTER_H

  // Thank you — pinned just above footer
  const THK_Y = FOOTER_Y - 15
  hline(doc, ML,      W / 2 - 26, THK_Y + 7, GOLD, 0.6)
  hline(doc, W/2+26,  W - MR,     THK_Y + 7, GOLD, 0.6)
  T(doc, 'Thank You for Shopping with Selections!', W / 2, THK_Y + 10,
    { size: 10, weight: 'bolditalic', color: DARK, align: 'center' })

  // Dark footer bar
  fillRect(doc, 0, FOOTER_Y, W, FOOTER_H, DARK)

  // Social buttons
  ;[
    ['f',  [59,  89,  152]],
    ['in', [193, 53,  132]],
    ['w',  [37,  211, 102]],
  ].forEach(([lbl, color], i) => {
    const bx = ML + i * 18
    fillRect(doc, bx, FOOTER_Y + 6, 14, 8, color)
    T(doc, lbl, bx + 7, FOOTER_Y + 11.5, { size: 6, weight: 'bold', color: WHITE, align: 'center' })
  })

  T(doc, 'www.selections.pk',                             ML + 62,  FOOTER_Y + 11,  { size: 7.5, color: SLATE })
  T(doc, 'selectionspk.official@gmail.com  ·  +92 317 8968927', W - MR, FOOTER_Y + 9,  { size: 6.5, color: SLATE, align: 'right' })
  T(doc, `© ${new Date().getFullYear()} Selections.pk — Lahore, Pakistan`, W - MR, FOOTER_Y + 18, { size: 6, color: [71, 85, 105], align: 'right' })

  doc.save(`Selections-Invoice-${order.order_number ?? order.id}.pdf`)
}
