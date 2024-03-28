document.addEventListener("DOMContentLoaded", function() {
    var membersList = document.getElementById("members-list");
    let memberDetailsContainer = document.getElementById("member-details-container");
    let displayMembersFlag = true; // Flag to control displaying member list
    let addMemberButton = document.getElementById("addMember");
    addMemberButton.addEventListener('click', () => {
        addMember();
    });
    displayMembers();
    
    // Function to display members in the UI
    function displayMembers() {
        if (displayMembersFlag) {
            // Make a GET request to fetch the list of clinic members
            fetch('http://localhost:5000/client')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    membersList.innerHTML = ''; // Clear previous members
                    // Loop through the list of members and create list items to display their details
                    console.log(data);
                    data.forEach(member => {
                        const listItem = document.createElement("li");
                        listItem.textContent = `${member.FullName} - ${member.ID}`;
                        listItem.addEventListener('click', () => {
                            toggleMemberDetails(member);
                        });

                        membersList.appendChild(listItem);

                    });
                    console.log(membersList);

                })
                .catch(error => console.error("Error fetching members:", error));
        }
    }

    function clearForm(form){
        // Loop through each element in the form
        for (let i = 0; i < form.elements.length; i++) {
            let element = form.elements[i];

            // Check if the element is an input, textarea, or select element
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                // Clear the value of the element
                element.value = '';
            }
        }

    }
    function addMember() {
        let formMember= document.getElementById("formMember");
        formMember.classList.remove('hidden'); // Show the form
        clearForm(formMember);  //to clear its last values
        document.getElementById("member-details-container").classList.add("hidden");
        
        let sendButton = document.getElementById("sendButton");
        if (sendButton) {
            formMember.removeChild(sendButton);
        }

        sendButton = document.createElement('button');
        sendButton.textContent = 'Create'; // Set button text
        sendButton.type = 'submit'; // Set button type
        sendButton.id = 'sendButton'; // Set button ID

        sendButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default form submission
            console.log(document.getElementById('dateOfBirth').value);            
            // Gather updated member details from the form fields
            const newMember = {
                ID: document.getElementById('id').value,
                FullName: document.getElementById('fullname').value,
                Address: document.getElementById('address').value,
                DateOfBirth: document.getElementById('dateOfBirth').value,
                Telephone: document.getElementById('telephone').value,
                MobilePhone: document.getElementById('mobilePhone').value,
                Vaccine1Date: document.getElementById('vaccine1Date').value,
                Vaccine1Manufacturer: document.getElementById('vaccine1Manufacturer').value,
                Vaccine2Date: document.getElementById('vaccine2Date').value,
                Vaccine2Manufacturer: document.getElementById('vaccine2Manufacturer').value,
                Vaccine3Date: document.getElementById('vaccine3Date').value,
                Vaccine3Manufacturer: document.getElementById('vaccine3Manufacturer').value,
                Vaccine4Date: document.getElementById('vaccine4Date').value,
                Vaccine4Manufacturer: document.getElementById('vaccine4Manufacturer').value,
                PositiveResultDate: document.getElementById('positiveResultDate').value,
                RecoveryDate: document.getElementById('recoveryDate').value
            };
            
            if(!(validateMemberData(newMember))){
                console.log("there is a mistake with dates");
                return;
            }
            // Make a POST request to update the member details
            fetch(`http://localhost:5000/client`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMember)
            })
            .then(response => {
                if (response.ok) {
                    // If update is successful, display a success message or handle it as needed
                    console.log('Member created successfully');
                    alert("member created successfully!");
                    displayMembers();
                    // Optionally, hide the update form or perform any other actions
                } else {
                    // If update fails, display an error message or handle it as needed
                    console.error('Failed to create member');
                    alert( 'Failed to create member');
                }
            })
            .catch(error => {
                // Handle network errors or other issues
                console.error('Error creating member :', error);
            });
            formMember.classList.add('hidden');
            formMember.removeChild(sendButton);
        });
        formMember.appendChild(sendButton);

    }

    // Function to toggle member details popup
    function toggleMemberDetails(member) {
        let formMember = document.getElementById("formMember");
        if (memberDetailsContainer.dataset.memberId === member.ID.toString()) {
            // Hide details if already displayed
            hideMemberDetails();
        } else {
            formMember.classList.add("hidden");
            // Display details if not already displayed
            displayMemberDetails(member);
        }
    }

    // Function to display member details popup
    function displayMemberDetails(member) {
        // Clear previous details
        memberDetailsContainer.innerHTML = '';

        // Create elements to display member details
        const detailsHeading = document.createElement("h2");
        detailsHeading.textContent = "Member Details:";
        memberDetailsContainer.appendChild(detailsHeading);

        const detailsList = document.createElement("ul");
        detailsList.classList.add("member-details-list");

        // Loop through the member details and create list items to display each detail
        for (let key in member) {
            if (member.hasOwnProperty(key)) {
                const detailItem = document.createElement("li");
                detailItem.textContent = `${key}: ${member[key]}`;
                detailsList.appendChild(detailItem);
            }
        }

        // Create buttons for deleting and updating member details
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', () => {
            deleteMember(member.ID);
        });

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update Details";
        updateButton.addEventListener('click', () => {
            UpdateOptions(member);
        });

        memberDetailsContainer.appendChild(detailsList);
        memberDetailsContainer.appendChild(deleteButton);
        memberDetailsContainer.appendChild(updateButton);
        memberDetailsContainer.dataset.memberId = member.ID;
        memberDetailsContainer.classList.remove('hidden'); // Show member details
    }

    // Function to hide member details popup
    function hideMemberDetails() {
        memberDetailsContainer.innerHTML = '';
        memberDetailsContainer.classList.add('hidden'); // Hide member details
    }

    //convert to format of yyyy-mm--dd
    function formatDate(dateString) {
        if(dateString == null)
            return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so we add 1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Function to delete member
    function deleteMember(memberId) {
        // Make a DELETE request to delete the member
        fetch(`http://localhost:5000/client/${memberId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                console.log("Member deleted successfully");
                return response.json(); // Return JSON response from server
            } else {
                console.error("Failed to delete member");
                alert("Failed to delete member")
            }
        })
        .then(data => {
            alert(data.message);

            // Hide member details container
            hideMemberDetails();
            // Fetch the updated list of members from the server
            displayMembers(); // Refresh member list after deleting a member
        })
        .catch(error => console.error("Error deleting member:", error));
    }

    // Function to validate member data before updating
function validateMemberData(updatedMember) {
    let dateOfBirth = new Date(updatedMember.DateOfBirth);
    let positiveResultDate = new Date(updatedMember.PositiveResultDate);
    let recoveryDate = new Date(updatedMember.RecoveryDate);

    // Check if vaccination dates are after the date of birth
    if (updatedMember.Vaccine1Date && new Date(updatedMember.Vaccine1Date) < dateOfBirth ||
        updatedMember.Vaccine2Date && new Date(updatedMember.Vaccine2Date) < dateOfBirth ||
        updatedMember.Vaccine3Date && new Date(updatedMember.Vaccine3Date) < dateOfBirth ||
        updatedMember.Vaccine4Date && new Date(updatedMember.Vaccine4Date) < dateOfBirth) {
        alert('Vaccination dates must be after the date of birth.');
        return false;
    }

    
    // Check if each vaccination date is after the vaccinations that preceded it
    if (updatedMember.Vaccine2Date && new Date(updatedMember.Vaccine2Date) < new Date(updatedMember.Vaccine1Date) ||
    updatedMember.Vaccine3Date && new Date(updatedMember.Vaccine3Date) < new Date(updatedMember.Vaccine2Date) ||
    updatedMember.Vaccine4Date && new Date(updatedMember.Vaccine4Date) < new Date(updatedMember.Vaccine3Date)) {
        alert('Each vaccination date must be after the vaccinations that preceded it.');
        return false;
    }

    // Check if recovery date is after positive result date
    if (recoveryDate & positiveResultDate & recoveryDate < positiveResultDate) {
        alert('Recovery date must be after the positive result date.');
        return false;
    }

    // Get references to form fields
    const fullname = document.getElementById('fullname');
    const telephone = document.getElementById('telephone');
    const mobilePhone = document.getElementById('mobilePhone');
    const id= document.getElementById('id');

    // Regular expressions for validation
    const idRegex = /^\d{9}$/;
    const nameRegex = /^[a-zA-Z ]{1,20}$/;
    const telephoneRegex = /^0\d{1}-?\d{7}$/;
    const mobilePhoneRegex = /^05\d{1}-\d{7}$/;
    const addressRegex = /^[a-zA-Z ]+,\s*[a-zA-Z ]+,\s*\d+$/;
    
    
    // Validate ID
    if (!idRegex.test(id.value)) {
        alert('Please enter a valid id (9 digits).');
        id.focus();
        return false;
    }

    // Validate Full Name
    if (!nameRegex.test(fullname.value)) {
        alert('Please enter a valid Full Name (up to 20 characters, letters and spaces only).');
        fullname.focus();
        return false;
    }

    // Validate Telephone
    if (!telephoneRegex.test(telephone.value)) {
        alert('Please enter a valid Telephone number (starting with 0, followed by 8 digits).');
        telephone.focus();
        return false;
    }

    // Validate Mobile Phone
    if (!mobilePhoneRegex.test(mobilePhone.value)) {
        alert('Please enter a valid Mobile Phone number (starting with 05, followed by 8 digits).');
        mobilePhone.focus();
        return false;
    }
    
    // Validate Address
    if (!addressRegex.test(address.value)) {
        alert('Please enter a valid Address (three parts separated by commas: letters, letters, numbers).');
        address.focus();
        return false;
    }
    return true; // Data is valid
}


    function UpdateOptions(member) {
        console.log(member);
        formMember.classList.remove('hidden'); // Show the form
            
        // Populate the form fields with the existing member details
        document.getElementById('id').value = member.ID;
        document.getElementById('fullname').value = member.FullName;
        document.getElementById('address').value = member.Address;
        document.getElementById('dateOfBirth').value = formatDate(member.DateOfBirth);
        document.getElementById('telephone').value = member.Telephone;
        document.getElementById('mobilePhone').value = member.MobilePhone;
        document.getElementById('vaccine1Date').value = formatDate(member.Vaccine1Date);
        document.getElementById('vaccine1Manufacturer').value = member.Vaccine1Manufacturer;
        document.getElementById('vaccine2Date').value = formatDate(member.Vaccine2Date);
        document.getElementById('vaccine2Manufacturer').value = member.Vaccine2Manufacturer;
        document.getElementById('vaccine3Date').value = formatDate(member.Vaccine3Date);
        document.getElementById('vaccine3Manufacturer').value = member.Vaccine3Manufacturer;
        document.getElementById('vaccine4Date').value = formatDate(member.Vaccine4Date);
        document.getElementById('vaccine4Manufacturer').value = member.Vaccine4Manufacturer;
        document.getElementById('positiveResultDate').value = formatDate(member.PositiveResultDate);
        document.getElementById('recoveryDate').value = formatDate(member.RecoveryDate);
    
        let sendButton = document.getElementById("sendButton");
        if (sendButton) {
            formMember.removeChild(sendButton);
        }

    
        sendButton = document.createElement('button');
        sendButton.textContent = 'Update'; // Set button text
        sendButton.type = 'submit'; // Set button type
        sendButton.id = 'sendButton'; // Set button ID
        
        sendButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default form submission
                
            // Gather updated member details from the form fields
            const updatedMember = {
                ID: member.ID,
                FullName: document.getElementById('fullname').value,
                Address: document.getElementById('address').value,
                DateOfBirth: document.getElementById('dateOfBirth').value,
                Telephone: document.getElementById('telephone').value,
                MobilePhone: document.getElementById('mobilePhone').value,
                Vaccine1Date: document.getElementById('vaccine1Date').value,
                Vaccine1Manufacturer: document.getElementById('vaccine1Manufacturer').value,
                Vaccine2Date: document.getElementById('vaccine2Date').value,
                Vaccine2Manufacturer: document.getElementById('vaccine2Manufacturer').value,
                Vaccine3Date: document.getElementById('vaccine3Date').value,
                Vaccine3Manufacturer: document.getElementById('vaccine3Manufacturer').value,
                Vaccine4Date: document.getElementById('vaccine4Date').value,
                Vaccine4Manufacturer: document.getElementById('vaccine4Manufacturer').value,
                PositiveResultDate: document.getElementById('positiveResultDate').value,
                RecoveryDate: document.getElementById('recoveryDate').value
            };

            if(!(validateMemberData(updatedMember))){
                console.log("there is a mistake with dates");
                return;
            }

            // Make a PUT request to update the member details
            fetch(`http://localhost:5000/client/${member.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedMember)
            })
            .then(response => {
                if (response.ok) {
                    // If update is successful, display a success message or handle it as needed
                    console.log('Member details updated successfully');
                    alert("member updated successfully!");
                    displayMembers();
                    // Optionally, hide the update form or perform any other actions
                } else {
                    // If update fails, display an error message or handle it as needed
                    // response=>response.json()
                    // .then(data=>{
                    //     alert(data.message);
                    // }),
                    if(response.status=='400')
                        alert("Failed to update member details. Missing required field");
                    else
                        alert('Failed to update member details')
                    console.error('Failed to update member details');
                }
                // sendButton.remove();
            }).catch(error => {
                // Handle network errors or other issues
                console.error('Error updating member details:', error);
                //  sendButton.remove();
            });
            formMember.classList.add('hidden');
            
            // document.getElementById('formMember').classList.add('remove');
            memberDetailsContainer.classList.add('hidden'); // Hide member details
            formMember.removeChild(sendButton);
        });
        formMember.appendChild(sendButton);
    } 
    }   
);
