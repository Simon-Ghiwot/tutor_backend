CREATE TABLE Course (
    name varchar(100) primary key
);

CREATE TABLE Tutor (
    id int primary key auto_increment,
    first_name varchar(255),
    last_name varchar(255),
    university varchar(255),
    course varchar(255),
    price decimal(10,2),
    status int,
    teaching_method varchar(255),
    profile_picture varchar(255),
    rating decimal(3,2),
    rating_count int default 0,
    password varchar(255),
    email varchar(255) unique,
    phone_number varchar(30),
    password_question varchar(255),
    password_answer varchar(255),
    has_premium bool default false,
    hours int DEFAULT 0,
    FOREIGN KEY (course) REFERENCES Course (name)
);

CREATE TABLE Tutor_assessment (
    id int primary key auto_increment,
    tutor_id int,
    course_name varchar(100),
    grade int,
    FOREIGN KEY (course_name) REFERENCES Course(name),
    FOREIGN KEY (tutor_id) REFERENCES Tutor (id)
);

CREATE TABLE Student (
    id int primary key auto_increment,
    first_name varchar(255),
    last_name varchar(255),
    profile_picture varchar(255),
    university varchar(255),
    academic_year int,
    email varchar(255) unique not null,
    password varchar(255),
    password_question varchar(255),
    password_answer varchar(255),
    phone_number varchar(30)
);

CREATE TABLE Rating (
    id int primary key auto_increment,
    tutor_id int,
    student_id int,
    score decimal(3,2),
    hours int,
    comment varchar(255),
    course_name varchar(100),
    FOREIGN KEY (tutor_id) REFERENCES Tutor (id),
    FOREIGN KEY (student_id) REFERENCES Student (id),
    FOREIGN KEY (course_name) REFERENCES Course (name)
);

CREATE TABLE Premium_subscription (
    id int primary key auto_increment,
    tutor_id int,
    start_date date,
    end_date date,
    FOREIGN KEY (tutor_id) REFERENCES Tutor (id)
);

CREATE TABLE Tutor_qualification (
    id int primary key auto_increment,
    tutor_id int,
    certificate varchar(255),
    course_name varchar(100),
    FOREIGN KEY (course_name) REFERENCES Course(name),
    FOREIGN KEY (tutor_id) REFERENCES Tutor (id)
);
