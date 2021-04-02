const { ipcMain } = require('electron')

const csv = require('csv-parser')
const fs = require('fs')
const builder = require('xmlbuilder')

ipcMain.on('convert-file', (event, {
  orgFilePath,
  filePath: outputFilePath,
  fileType,
  genDate
}) => {
  const dataObj = {
    VendorClaims: {
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
      HEADER: {
        FILE_TYPE: fileType,
        GEN_DATE: genDate
      },
      GROUP: []
    }
  }

  fs.createReadStream(orgFilePath)
    .pipe(csv())
    .on('data', (row) => {
      console.log(row)
      const {
        PROJECT_TYPE_ID: PROJ_TYPE_ID,
        Lead: LEAD,
        ADJ_TYPE,
        DESCRIPTION,
        PROJECT_ID,
        'Claim Number': CLAIM_NUM,
        'Provider Name': PROV_NAME,
        'Provider Address': PROVIDER_ADDR,
        'Provdier City': PROVIDER_CITY,
        'Provider State': PROVIDER_STATE,
        'Provider Zip': PROVIDER_ZIP,
        'Tax ID': TAX_ID,
        'Provider NPI': PROVIDER_NPI,
        'Payee ID': PAYEE_ID,
        'Amt to Per': AMT_TO_PER,
        AMT_COLLECTED,
        BEGIN_DATE,
        END_DATE_OF,
        PATIENT_ACCT_NUMB,
        PATIENT_LAST_NAME,
        PATIENT_FIRST_N,
        PATIENT_DA: PATIENT_DOB,
        PATEINT_S: PATIENT_SSN,
        PROV_PHONE_NO,
        PROJ_TYPE_NAME,
        PROJ_TYPE_DESC,
        MARKET_CF: MARKET,
        SOURCE,
        REASON_FOR_OVER: REASON_FOR_OVERPAYMENT,
        LETTER_VERBIAGE,
        CCU_STATUS_CODE,
        CCU_STATUS_DESC,
        CCU_STATUS_DATE,
        'CCU STATUS WRITE OFF REVIEW': WRITE_OFF_REASON,
        REMITTANCE_TYPE,
        'REMITTANCE ID': REMITTANCE_ID,
        Payor_name: PAYOR_NAME,
        Check_Date: CHECK_DATE,
        CHECK_AMOUNT,
        Bypass_Indicator: BYPASS_INDICATOR
      } = row
      let groupIndex = dataObj.VendorClaims.GROUP.findIndex(item => item.PROJECT_ID === PROJECT_ID)
      if (groupIndex < 0) {
        groupIndex = dataObj.VendorClaims.GROUP.push({
          PROJ_TYPE_ID,
          LEAD,
          ADJ_TYPE,
          DESCRIPTION,
          PROJECT_ID,
          DETAIL: []
        }) - 1
        console.log('new groupIndex: ', groupIndex)
      }

      dataObj.VendorClaims.GROUP[groupIndex].DETAIL.push({
        CLAIM_NUM,
        PROV_NAME,
        PROVIDER_ADDR,
        PROVIDER_CITY,
        PROVIDER_STATE,
        PROVIDER_ZIP,
        TAX_ID,
        PROVIDER_NPI,
        PAYEE_ID,
        AMT_TO_PER,
        AMT_COLLECTED,
        BEGIN_DATE,
        END_DATE_OF,
        PATIENT_ACCT_NUMB,
        PATIENT_LAST_NAME,
        PATIENT_FIRST_N,
        PATIENT_DOB,
        PATIENT_SSN,
        PROV_PHONE_NO,
        PROJ_TYPE_NAME,
        PROJ_TYPE_DESC,
        MARKET,
        SOURCE,
        REASON_FOR_OVERPAYMENT,
        LETTER_VERBIAGE,
        CCU_STATUS_CODE,
        CCU_STATUS_DESC,
        CCU_STATUS_DATE,
        WRITE_OFF_REASON,
        REMITTANCE_TYPE,
        REMITTANCE_ID,
        PAYOR_NAME,
        CHECK_DATE,
        // CHECK_AMOUNT,
        BYPASS_INDICATOR
      })
    })
    .on('end', () => {
      console.log('CSV file successfully processed')
      // console.log('dataObj: ', dataObj)

      const xmlData = builder.create(dataObj, { encoding: 'utf-8' })
      fs.writeFile(outputFilePath, xmlData.end({ pretty: true }), (err, data) => {
        if (err) {
          return console.log('error:', err)
        }
        console.log('outputFilePath: ', outputFilePath)
        console.log('data:', data)
      })
      // console.log(xmlData.end({ pretty: true }))
    })
})
