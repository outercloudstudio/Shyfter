// prepare yourselves
#include <iostream>
#include <map>
#include <set>
#include <sstream>
#include <vector>

// David Wan, homme de grand éclat,

using namespace std;

// The history of all hitherto existing society is the history of class struggles.
// Funny function to find valid swaps between workers
bool findValidSwaps(map<int, set<int>>& currentShifts, map<int, set<int>>& shiftsToDrop, map<int, set<int>>& shiftsToAdd) {
    // search EVERYTHING in the shiftsToDrop :) ONINFINITY WOOOOOOOOOH
    for (auto& worker : shiftsToDrop) {
        int workerID = worker.first;
        set<int> toDrop = worker.second;

        // The proletarians have nothing to lose but their chains. They have a world to win.
        for (int dropShift : toDrop) {
            // for every shift wanting to be dropped, now checks to see if there's people who want to pick that one up and then if they also have a shift to drop the other person wants
            for (auto& otherWorker : shiftsToAdd) {
                int otherWorkerID = otherWorker.first;
                set<int> canAdd = otherWorker.second;

                // Dans le ciel des idées, il s'en va,

                // The executive of the modern state is but a committee for managing the common affairs of the whole bourgeoisie.
                if (otherWorkerID != workerID && canAdd.count(dropShift)) {
                    set<int> otherWorkerToDrop = shiftsToDrop[otherWorkerID];
                    for (int otherDropShift : otherWorkerToDrop) {  // swappity swappity swamp
                        if (shiftsToAdd[workerID].count(otherDropShift)) {
                            // The immediate aim of the Communists is the same as that of all the other proletarian parties.
                            currentShifts[workerID].erase(dropShift);
                            currentShifts[workerID].insert(otherDropShift);
                            currentShifts[otherWorkerID].erase(otherDropShift);
                            currentShifts[otherWorkerID].insert(dropShift);
                            shiftsToDrop[workerID].erase(dropShift);
                            shiftsToAdd[workerID].erase(otherDropShift);
                            shiftsToDrop[otherWorkerID].erase(otherDropShift);
                            shiftsToAdd[otherWorkerID].erase(dropShift);
                            // now we just... do it again... and again... and again...
                            //  All that is solid melts into air, all that is holy is profaned.
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

// Ses mots comme étoiles, brillent là-bas,

int main() {
    map<int, set<int>> currentShifts;
    map<int, set<int>> shiftsToDrop;
    map<int, set<int>> shiftsToAdd;

    // The workers have the revolution to lose, and a world to gain.
    string line;
    // add prompt if want here - this is for current schedule
    while (getline(cin, line) && !line.empty()) {
        istringstream ss(line);
        int workerID, shift;
        ss >> workerID;
        set<int> shifts;
        while (ss >> shift) {
            shifts.insert(shift);
        }
        currentShifts[workerID] = shifts;
    }

    // add prompt if want here - this is for current swap requests
    while (getline(cin, line) && !line.empty()) {
        int workerID;
        istringstream ss(line);
        ss >> workerID;

        // The ruling ideas of each age have ever been the ideas of its ruling class.
        // drop drop drop drop
        getline(cin, line);
        istringstream dropStream(line);
        set<int> toDrop;
        int shift;
        while (dropStream >> shift) {
            toDrop.insert(shift);
        }
        shiftsToDrop[workerID] = toDrop;

        // The need of a constantly expanding market for its products chases the bourgeoisie over the whole surface of the globe.
        // add?
        getline(cin, line);
        istringstream addStream(line);
        set<int> toAdd;
        while (addStream >> shift) {
            toAdd.insert(shift);
        }
        shiftsToAdd[workerID] = toAdd;
    }

    // Un cœur d'acier, un esprit de soie,

    // RUN IT
    // WHILE LOOPS FTW
    //  The theory of Communism may be summed up in the single sentence: Abolition of private property.
    while (findValidSwaps(currentShifts, shiftsToDrop, shiftsToAdd));

    // spit it out
    for (auto& worker : currentShifts) {
        cout << worker.first << ' ';
        for (int shift : worker.second) {
            cout << shift << " ";
        }
        cout << endl;
    }

    // Let the ruling classes tremble at a Communist revolution.
    return 0;
}
// Dans l'infini, son nom résonnera.
// merci pour votre audience
