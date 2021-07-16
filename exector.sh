split -l 20000 $1 splited_files/ 
node app.js

cd ./generated_json

for file in *; do
    gsutil cp "$file" gs://expedia-static-data
    bq load --source_format=NEWLINE_DELIMITED_JSON suppliers_dashboard._expedia_static_data_test gs://expedia-static-data/"$file"
done



