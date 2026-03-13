package com.smartprep.config;

import com.smartprep.model.*;
import com.smartprep.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Seeds the database with 4 subject-wise mock tests (10 MCQs each).
 * Runs once on startup, skipped if data already exists.
 */
@Component
public class DataInitializer implements ApplicationRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private ExamRepository examRepository;
    @Autowired private SubjectRepository subjectRepository;
    @Autowired private MockTestRepository mockTestRepository;
    @Autowired private TestQuestionRepository testQuestionRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (mockTestRepository.count() > 0) return;  // idempotent guard

        // System user for seeded tests
        User systemUser = userRepository.findByEmail("system@smartprep.app").orElseGet(() -> {
            User u = User.builder()
                    .name("SmartPrep System")
                    .email("system@smartprep.app")
                    .passwordHash("$2a$10$DISABLED_ACCOUNT_HASH_PLACEHOLDER")
                    .examType("global")
                    .studyHoursPerDay(0)
                    .breakDuration(0)
                    .build();
            return userRepository.save(u);
        });

        Exam globalExam = examRepository.save(Exam.builder()
                .user(systemUser)
                .name("Global Practice Exam")
                .examDate(LocalDate.now().plusYears(1))
                .examType("global")
                .build());

        seedDataStructures(globalExam);
        seedDBMS(globalExam);
        seedOS(globalExam);
        seedAlgorithms(globalExam);
    }

    private void seedDataStructures(Exam exam) {
        Subject subj = subjectRepository.save(Subject.builder()
                .exam(exam).name("Data Structures").difficulty("Medium").build());

        MockTest test = mockTestRepository.save(MockTest.builder()
                .subject(subj).title("Data Structures — Fundamentals")
                .difficulty("Medium").totalQuestions(10).durationMinutes(20).isLocked(false).build());

        saveQs(test, new String[][]{
            {"What is the time complexity of accessing an element in an array?", "O(n)", "O(1)", "O(log n)", "O(n²)", "B"},
            {"Which data structure uses LIFO order?", "Queue", "Array", "Stack", "Linked List", "C"},
            {"Which data structure uses FIFO order?", "Stack", "Queue", "Tree", "Graph", "B"},
            {"What is the height of a balanced binary tree with n nodes?", "O(n)", "O(n²)", "O(log n)", "O(1)", "C"},
            {"Which traversal visits root FIRST in a binary tree?", "Inorder", "Postorder", "Preorder", "Level order", "C"},
            {"What is the worst-case time complexity of linear search?", "O(1)", "O(log n)", "O(n log n)", "O(n)", "D"},
            {"A doubly linked list node contains:", "One pointer", "No pointers", "Two pointers", "Three pointers", "C"},
            {"Which heap property states each parent is smaller than its children?", "Max-Heap", "Min-Heap", "B-Tree", "AVL Tree", "B"},
            {"What is a hash collision?", "Two keys hash to the same index", "A key has no hash value", "Hash table overflow", "Empty hash table", "A"},
            {"Which data structure is used to implement recursion?", "Queue", "Stack", "Array", "Linked List", "B"}
        });
    }

    private void seedDBMS(Exam exam) {
        Subject subj = subjectRepository.save(Subject.builder()
                .exam(exam).name("DBMS").difficulty("Medium").build());

        MockTest test = mockTestRepository.save(MockTest.builder()
                .subject(subj).title("DBMS — SQL & Relational Concepts")
                .difficulty("Medium").totalQuestions(10).durationMinutes(20).isLocked(false).build());

        saveQs(test, new String[][]{
            {"What does SQL stand for?", "Structured Query Language", "Simple Query Language", "Sequential Query Logic", "Standard Query List", "A"},
            {"Which SQL command retrieves data?", "INSERT", "DELETE", "SELECT", "UPDATE", "C"},
            {"What is a primary key?", "A key that can be NULL", "Uniquely identifies each row", "Any column in a table", "A foreign key reference", "B"},
            {"Which normal form eliminates transitive dependencies?", "1NF", "2NF", "3NF", "BCNF", "C"},
            {"What is a foreign key?", "Primary key of another table referenced here", "Any column", "An indexed column", "A duplicate key", "A"},
            {"Which JOIN returns all rows from both tables?", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "D"},
            {"What is an index in DBMS?", "A data structure that speeds up queries", "A backup of a table", "A type of constraint", "A trigger", "A"},
            {"ACID stands for:", "Atomicity, Consistency, Isolation, Durability", "Access, Control, Integration, Data", "Application, Code, Index, Data", "None of the above", "A"},
            {"Which command removes all rows but keeps table structure?", "DROP", "DELETE", "TRUNCATE", "ALTER", "C"},
            {"What is a view in SQL?", "A virtual table based on a query", "A physical copy of a table", "A stored procedure", "An index", "A"}
        });
    }

    private void seedOS(Exam exam) {
        Subject subj = subjectRepository.save(Subject.builder()
                .exam(exam).name("Operating Systems").difficulty("Hard").build());

        MockTest test = mockTestRepository.save(MockTest.builder()
                .subject(subj).title("Operating Systems — Process & Memory")
                .difficulty("Hard").totalQuestions(10).durationMinutes(25).isLocked(false).build());

        saveQs(test, new String[][]{
            {"What is a process?", "A program in execution", "A stored program", "A CPU instruction", "A file on disk", "A"},
            {"Which scheduling gives CPU to the process with shortest burst time?", "FCFS", "Round Robin", "SJF", "Priority", "C"},
            {"What is a deadlock?", "Processes waiting forever for each other's resources", "A crashed process", "A slow process", "None of the above", "A"},
            {"What is virtual memory?", "Extends RAM using disk space", "Cache memory", "ROM", "A type of register", "A"},
            {"Which page replacement replaces the least recently used page?", "FIFO", "Optimal", "LRU", "Clock", "C"},
            {"What is thrashing?", "Excessive paging causing low CPU utilization", "CPU overheating", "Memory overflow", "Disk fragmentation", "A"},
            {"Semaphores are used to solve:", "Deadlock only", "Process synchronization", "Memory allocation", "CPU scheduling", "B"},
            {"What is a context switch?", "Saving/restoring process state when switching CPU", "Switching network connections", "Changing file permissions", "Formatting a disk", "A"},
            {"Which is NOT a Coffman deadlock condition?", "Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait", "C"},
            {"What is the purpose of the page table?", "Maps virtual to physical addresses", "Stores OS kernel code", "Tracks open files", "Manages CPU registers", "A"}
        });
    }

    private void seedAlgorithms(Exam exam) {
        Subject subj = subjectRepository.save(Subject.builder()
                .exam(exam).name("Algorithms").difficulty("Hard").build());

        MockTest test = mockTestRepository.save(MockTest.builder()
                .subject(subj).title("Algorithms — Sorting & Complexity")
                .difficulty("Hard").totalQuestions(10).durationMinutes(25).isLocked(false).build());

        saveQs(test, new String[][]{
            {"What is the average time complexity of QuickSort?", "O(n²)", "O(n)", "O(n log n)", "O(log n)", "C"},
            {"Which sorting algorithm is stable and O(n log n) worst case?", "QuickSort", "HeapSort", "MergeSort", "SelectionSort", "C"},
            {"Binary search requires the array to be:", "Sorted", "Unsorted", "Contains only integers", "Has unique elements", "A"},
            {"Time complexity of Dijkstra with min-heap?", "O(n²)", "O((V + E) log V)", "O(V log E)", "O(E²)", "B"},
            {"Which technique is used in Dynamic Programming?", "Divide and Conquer", "Greedy", "Memoization / Tabulation", "Backtracking", "C"},
            {"The 0/1 Knapsack problem is solved using:", "Greedy only", "Dynamic Programming", "Binary Search", "BFS", "B"},
            {"BFS is best used for:", "Shortest path in unweighted graph", "Minimum spanning tree", "Topological sort", "Finding cycles", "A"},
            {"Space complexity of MergeSort?", "O(1)", "O(log n)", "O(n)", "O(n log n)", "C"},
            {"Which algorithm finds Minimum Spanning Tree?", "Dijkstra", "Bellman-Ford", "Kruskal", "Floyd-Warshall", "C"},
            {"O(1) space complexity means:", "Constant extra space regardless of input size", "Space grows linearly", "No memory used", "Space halves each step", "A"}
        });
    }

    private void saveQs(MockTest test, String[][] questions) {
        for (String[] q : questions) {
            testQuestionRepository.save(TestQuestion.builder()
                    .mockTest(test)
                    .questionText(q[0])
                    .optionA(q[1])
                    .optionB(q[2])
                    .optionC(q[3])
                    .optionD(q[4])
                    .correctOption(q[5])
                    .build());
        }
    }
}
