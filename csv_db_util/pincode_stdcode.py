import csv
import sqlite3

def create_table(conn, table_name, csv_file):
    cursor = conn.cursor()
    with open(csv_file, 'r') as file:
        csv_reader = csv.DictReader(file)
        header = csv_reader.fieldnames
        columns = ', '.join(header)
        query = f"CREATE TABLE {table_name} ({columns})"
        cursor.execute(query)

        for row in csv_reader:
            values = ', '.join(f"'{value}'" for value in row.values())
            query = f"INSERT INTO {table_name} ({columns}) VALUES ({values})"
            cursor.execute(query)

    conn.commit()

def run_sql_query_on_csv(sql_query, output_csv):
    conn = sqlite3.connect(':memory:')

    # create_table(conn, "pincode", "./pincode.csv")
    # create_table(conn, "stdcode", "./stdcode.csv")
    # create_table(conn, "pincode", "./out1.csv")
    # create_table(conn, "stdcode", "./out2.csv")
    create_table(conn, "pincode", "./out4.csv")
    create_table(conn, "stdcode", "./out5.csv")
    conn.commit()

    cursor = conn.cursor()
    cursor.execute(sql_query)
    results = cursor.fetchall()
    with open(output_csv, 'w', newline='') as file:
        csv_writer = csv.writer(file)
        csv_writer.writerow(["state","key", "value"])
        csv_writer.writerows(results)

    conn.close()

    return results


# Example usage
# sql_query = "SELECT state, key, GROUP_CONCAT(pincode ,':') FROM pincode group by state, key"
# sql_query = "SELECT state, key, GROUP_CONCAT(stdcode ,':') FROM stdcode group by state, key"
# sql_query = "SELECT * FROM pincode FULL OUTER JOIN stdcode ON pincode.key = stdcode.key";
# sql_query = "SELECT s.state, s.key, s.value, p.state, p.key, p.value FROM stdcode as s, pincode as p where s.state = p.state and s.key = p.key"
sql_query = "SELECT s.state, s.key, s.value, p.state, p.key, p.value FROM stdcode as s, pincode as p where s.state <> p.state and s.key = p.key"
out_file = "./out7.csv"

query_results = run_sql_query_on_csv(sql_query, out_file)

for row in query_results:
    print(row)
