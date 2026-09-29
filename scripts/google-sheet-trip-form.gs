/**
 * Jazora Holidays — save trip form rows into THIS Google Sheet
 *
 * After editing: Deploy → Manage deployments → Edit (pencil) → New version → Deploy
 *
 * Duplicate rule: same email OR same phone (digits only) → { ok:false, duplicate:true }
 */

var HEADERS = ["Timestamp", "Name", "Phone", "Email", "Destination", "Promo", "Source"]

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold")
    sheet.setFrozenRows(1)
    return
  }
  var first = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0]
  if (String(first[0]).toLowerCase() !== "timestamp") {
    sheet.insertRowBefore(1)
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold")
    sheet.setFrozenRows(1)
  }
}

function normalizeEmail_(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
}

function normalizePhone_(value) {
  return String(value || "").replace(/\D/g, "")
}

function findDuplicate_(sheet, email, phone) {
  var lastRow = sheet.getLastRow()
  if (lastRow < 2) return null

  // Columns: A Timestamp, B Name, C Phone, D Email
  var values = sheet.getRange(2, 1, lastRow, 4).getValues()
  var emailNorm = normalizeEmail_(email)
  var phoneNorm = normalizePhone_(phone)

  for (var i = 0; i < values.length; i++) {
    var rowPhone = normalizePhone_(values[i][2])
    var rowEmail = normalizeEmail_(values[i][3])
    if (emailNorm && rowEmail && rowEmail === emailNorm) {
      return { field: "email" }
    }
    if (phoneNorm && rowPhone && rowPhone === phoneNorm) {
      return { field: "phone" }
    }
  }
  return null
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}")
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    ensureHeaders_(sheet)

    var dup = findDuplicate_(sheet, data.email, data.phone)
    if (dup) {
      return json_({
        ok: false,
        duplicate: true,
        field: dup.field,
        error: "Already submitted",
      })
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || "",
      data.phone || "",
      data.email || "",
      data.destination || "",
      data.promo || "No",
      data.source || "jazora-web",
    ])

    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

function doGet() {
  return ContentService.createTextOutput("Jazora trip form webhook is live.")
}
