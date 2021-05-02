Read-Host -Prompt "Press any key to start"

# create an instance of excel
$excel = New-Object -comobject Excel.Application

# make it visible
$excel.Visible = $True  
  
# keep this variable in sync with env variables
$FilePath = 'C:\\Users\\PUKHRAJ LAKHARA\\Downloads\\Dummy.xlsm'

# open  workbook 
$workbook = $excel.Workbooks.Open($FilePath)

# Run macro
$app = $excel.Application
$app.Run("macro_timer")

Read-Host -Prompt "Press any key to continue"

# close the workbook, saving changes
$workbook.Close($true)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($Workbook)
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel)
Remove-Variable excel
[System.GC]::Collect()


Read-Host -Prompt "Press any key to exit"

exit