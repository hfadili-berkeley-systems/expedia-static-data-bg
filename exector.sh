sudo split 80000 $1 splited_files/ 
sudo node app.js

cd ./generated_json

for file in *; do
    gsutil cp "$file" gs://expedia-static-data
    bq load --source_format=NEWLINE_DELIMITED_JSON suppliers_dashboard._expedia_static_data_test gs://expedia-static-data/"$file"
done

cd ../
sudo rm generated_json/*
sudo rm splited_files/*
