# create an instance of excel
$a = New-Object -comobject Excel.Application

# make it visible
$a.Visible = $True  
  
# keep this variable in sync with env variables
$FilePath = '/Users/slakhara/Downloads/InvestingExcel.xlsx'

# open  workbook 
$b = $a.Workbooks.Open($FilePath)

# close the workbook, saving changes
$b.Close($true)