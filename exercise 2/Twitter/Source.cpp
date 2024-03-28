#include <iostream>
#include <cmath>
using namespace std;

void Rec(int w, int h) {
	if (w == h || w - h > 5 || h - w > 5)
		cout << "the area is: " << w * h << endl;
	else cout << "the scope is: " << 2 * h + 2 * w << endl;
}

string calcSpace(int i, int w) {
	int num = (w - i) / 2;
	string s = ""; 
	while (num > 0) {
		s += ' ';
		num--;
	}
	return s;

}
void printTri(int w, int h) {
	if (w % 2 == 0 || w > 2 * h) {
		cout << "can not printing the truangle\n";
		return;
	}
	int betweenRows = h - 2;
	int oddNumbersBetween = (w - 1) / 2 - 1;
	int linesForNum = betweenRows / oddNumbersBetween;
	int additionRows = betweenRows % oddNumbersBetween;


	for (int i = 1; i <= w; i+=2) {
		string space = calcSpace(i, w);
		string kochavit = "";
		for (int k = 0; k < i; k++)
			kochavit += '*';

		if (i == 3 && additionRows != 0) 
			for (int add = 1; add <= additionRows; add++) {
				cout << space << kochavit << endl;
			}
		
		for (int row = 0; row < linesForNum; row++) {
			cout << space << kochavit << endl;
			if (i == 1 || i == w)//for 1 anf w I want only one row be printed
				break;
		}
	}

}

int calculateScope(int w, int h) {
    double side = sqrt(pow(w / 2, 2) + pow(h, 2));
    double perimeter = 2 * side + width;
    return perimeter;
}


void main() {
	int code = 0;
	int width, height;
	int choose;

	cout << "choose:\n1- rectangle town\n2- triangle town\n3- exit\n";
	cin >> code;

	while (code != 3){
		cout << "enter width and height\n";
		cin >> width >> height;
		
		switch (code) {
			case 1: 
				Rec(width,height);
				break;

			case 2: 
				cout << "press 1 for the scope, and 2 for printing\n";
				cin >> choose;
				while (choose != 1 && choose != 2) {
					cout << "wrong choose\n";
					cout << "press 1 for the scope, and 2 for printing\n";
				}

				if (choose == 1) {
					int scope = calculateScope(width, height);
					cout << "the scope is: " + scope << endl;
				}
				else //if (choose == 2) 
					printTri(width, height);
				break;

			default: cout << "wrong choose";
		}
		cout << "choose:\n1- rectangle town\n2- triangle town\n3- exit\n";
		cin >> code;
	}
	//pressed 3
	cout << "exit...";
	return;
}
