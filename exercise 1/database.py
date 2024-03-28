import mysql.connector

# Connect to the database
def connect_to_database():
    db_con = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234",
        database = "CoronaDB"
    )
    print(db_con)


    return db_con


def close_connection_to_database(db_con):
    db_con.close()


# Function to insert member details into the database
def get_all_members(db_con):
    # Implement insertion logic here
    cur = db_con.cursor()
    cur.execute("select * from Members")
    all_members = cur.fetchall()  # bring list of tuples, each tuple presents a row.

    ids = [column[0] for column in cur.description]

    members_list = []
    # create a dictionary for each member.
    for member in all_members:
        member_dict = dict(zip(ids, member))
        members_list.append(member_dict)
    cur.close()
    return members_list


# Function that ass new mwmber to the database
def add_member(db_con, member_data):
    try:
        cursor = db_con.cursor()

        # Insert member data into the database
        insert_query = """
            INSERT INTO Members (ID, FullName, Address, DateOfBirth, Telephone, MobilePhone, 
                                 Vaccine1Date, Vaccine1Manufacturer, Vaccine2Date, Vaccine2Manufacturer, 
                                 Vaccine3Date, Vaccine3Manufacturer, Vaccine4Date, Vaccine4Manufacturer, 
                                 PositiveResultDate, RecoveryDate)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(insert_query, member_data)

        # Check if the insertion was successful
        if cursor.rowcount > 0:
            # Commit changes and close the connection
            db_con.commit()
            cursor.close()
            return True
        else:
            print("no rows affected")
            return False

    except mysql.connector.Error as error:
        print("Error:", error)
        return False



# Function to delete a member from the database
def delete_member(db_con, member_id):
    try:
        cursor = db_con.cursor()

        # Delete the member from the database
        delete_query = "DELETE FROM Members WHERE ID = %s"
        cursor.execute(delete_query, (member_id,))

        # Commit changes and close the connection
        db_con.commit()
        cursor.close()

        return True
    except mysql.connector.Error as error:
        print("Error:", error)
        return False


def get_member_by_id(connection, member_id):
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM members WHERE ID = %s"
    cursor.execute(query, (member_id,))
    member = cursor.fetchone()
    cursor.close()
    return member


def update_member(connection, member):
    cursor = connection.cursor()
    query = """
        UPDATE members
        SET FullName = %s, Address = %s, DateOfBirth = %s,
            Telephone = %s, MobilePhone = %s,
            Vaccine1Date = %s, Vaccine1Manufacturer = %s,
            Vaccine2Date = %s, Vaccine2Manufacturer = %s,
            Vaccine3Date = %s, Vaccine3Manufacturer = %s,
            Vaccine4Date = %s, Vaccine4Manufacturer = %s,
            PositiveResultDate = %s, RecoveryDate = %s
        WHERE ID = %s
    """
    values = (
        member['FullName'], member['Address'], member['DateOfBirth'],
        member['Telephone'], member['MobilePhone'],
        member.get('Vaccine1Date', None), member.get('Vaccine1Manufacturer', None),
        member.get('Vaccine2Date', None), member.get('Vaccine2Manufacturer', None),
        member.get('Vaccine3Date', None), member.get('Vaccine3Manufacturer', None),
        member.get('Vaccine4Date', None), member.get('Vaccine4Manufacturer', None),
        member.get('PositiveResultDate', None), member.get('RecoveryDate', None),
        member['ID']
    )
    cursor.execute(query, values)
    connection.commit()
    affected_rows = cursor.rowcount
    cursor.close()
    return affected_rows > 0










