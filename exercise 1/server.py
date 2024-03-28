from flask import Flask, request, jsonify
from flask_cors import CORS
import database
from datetime import datetime

app = Flask(__name__)
CORS(app, origins="*")

# Initialize database connection
db_connection = database.connect_to_database()

# Define API endpoints
@app.route('/client', methods=['GET'])
def get_all_members():
    members = database.get_all_members(db_connection)
    return jsonify(members)


@app.route('/client/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    success = database.delete_member(db_connection, member_id)
    if success:
        # After deleting the member, fetch the updated list of members
        updated_members = database.get_all_members(db_connection)
        print(updated_members)
        return jsonify({'message': f'Member with ID {member_id} deleted successfully', 'members': updated_members}), 200
    else:
        return jsonify({'error': f'Failed to delete member with ID {member_id}'}), 500


#to add a member
@app.route('/client', methods=['POST'])
def add_member():
    member_data = request.json

    required_fields = ['ID', 'FullName', 'Address', 'DateOfBirth', 'Telephone', 'MobilePhone']
    for field in required_fields:
        if member_data[field] == '':
            return jsonify({'error': f'Missing required field: {field}'}), 400

    member_data['ID'] = int(member_data['ID'])

    datesFields = ['DateOfBirth','Vaccine1Date', 'Vaccine2Date', 'Vaccine3Date', 'Vaccine4Date', 'PositiveResultDate',
                       'RecoveryDate']
    for field in datesFields:
        if member_data[field] == '':
            member_data[field] = None
        else:
            member_data[field] = datetime.strptime(member_data[field], "%Y-%m-%d").date()

    success = database.add_member(db_connection, member_data)
    if success:
        return jsonify({'message': 'Member added successfully'}), 201
    else:
        return jsonify({'error': 'Failed to add member'}), 500


@app.route('/client/<int:member_id>', methods=['PUT'])
def update_member(member_id):
    member_data = request.json

    # Check if member exists
    existing_member = database.get_member_by_id(db_connection, member_id)
    if existing_member is None:  #they sent empty form
        return jsonify({'error': f'Member with ID {member_id} not found'}), 404

    required_fields = ['ID', 'FullName', 'Address', 'DateOfBirth', 'Telephone', 'MobilePhone']
    for field in required_fields:
        if member_data[field] == '':
            return jsonify({'error': f'Missing required field: {field}'}), 400

    # Update member data
    for key, value in member_data.items():
        if key != 'ID':
            existing_member[key] = value

    vacinatesFields = ['Vaccine1Date', 'Vaccine2Date', 'Vaccine3Date', 'Vaccine4Date', 'PositiveResultDate',
                       'RecoveryDate']
    for field in vacinatesFields:
        if member_data[field] == '':
            existing_member[field] = None

    success = database.update_member(db_connection, existing_member)
    if success:
        updated_member = database.get_member_by_id(db_connection, member_id)
        return jsonify({'message': f'Member with ID {member_id} updated successfully', 'member': updated_member}), 200
    else:
        return jsonify({'error': f'Failed to update member with ID {member_id}'}), 500


if __name__ == '__main__':
    app.run(debug=True)

