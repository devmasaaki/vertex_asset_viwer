#!/usr/bin/php
<?php

/*

	Usage: csv2json.php <path to .csv file>

*/

$SCRIPT_PARENT_DIR = dirname($argv[0]);
$SOURCE_CSV_PATH = $argv[1];
$SOURCE_JSON_PATH = dirname($SOURCE_CSV_PATH) . "/" . basename($SOURCE_CSV_PATH, ".csv") . ".json";

if (empty($SOURCE_CSV_PATH)) die("The csv file name or URL is missed\n");

// Arrays we'll use later
$keys = array();
$newArray = array();

// Function to convert CSV into associative array
function csvToArray($file, $delimiter) { 
  if (($handle = fopen($file, 'r')) !== FALSE) { 
    $i = 0; 
    while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) { 
      for ($j = 0; $j < count($lineArray); $j++) { 
        $arr[$i][$j] = $lineArray[$j]; 
      } 
      $i++; 
    } 
    fclose($handle); 
  } 
  return $arr; 
} 

// Do it
$data = csvToArray($SOURCE_CSV_PATH, ',');

// Set number of elements (minus 1 because we shift off the first row)
$count = count($data) - 1;
  
// Use first row for names  
$labels = array_shift($data);  
foreach ($labels as $label) {
  $keys[] = $label;
}

// Add Ids, just in case we want them later
$keys[] = 'id';
for ($i = 0; $i < $count; $i++) {
  $data[$i][] = 'PDF' . $i;
}
  
// Bring it all together
for ($j = 0; $j < $count; $j++) {
  $d = array_combine($keys, $data[$j]);
  $newArray[$j] = $d;
}


// Write it out as JSON
// echo json_encode($newArray, JSON_PRETTY_PRINT);
$jsonFile = fopen($SOURCE_JSON_PATH, "w");
fputs($jsonFile, json_encode($newArray, JSON_PRETTY_PRINT));
fclose($jsonFile);

?>