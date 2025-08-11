-- +goose Up
-- +goose StatementBegin
INSERT INTO books (isbn, title, author, publisher, year_of_publication, category, image_url) VALUES

-- PROGRAMMING BOOKS (20 books)
('9780132350884', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Prentice Hall', 2008, 'programming', 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg'),
('9780134685991', 'Effective Java', 'Joshua Bloch', 'Addison-Wesley Professional', 2017, 'programming', 'https://covers.openlibrary.org/b/isbn/9780134685991-L.jpg'),
('9780201633610', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 'Addison-Wesley Professional', 1994, 'programming', 'https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg'),
('9780137081073', 'The Clean Coder: A Code of Conduct for Professional Programmers', 'Robert C. Martin', 'Prentice Hall', 2011, 'programming', 'https://covers.openlibrary.org/b/isbn/9780137081073-L.jpg'),
('9780596517748', 'JavaScript: The Good Parts', 'Douglas Crockford', 'O''Reilly Media', 2008, 'programming', 'https://covers.openlibrary.org/b/isbn/9780596517748-L.jpg'),
('9780134190440', 'The Go Programming Language', 'Alan Donovan, Brian Kernighan', 'Addison-Wesley Professional', 2015, 'programming', 'https://covers.openlibrary.org/b/isbn/9780134190440-L.jpg'),
('9781617291784', 'Go in Action', 'William Kennedy, Brian Ketelsen, Erik St. Martin', 'Manning Publications', 2015, 'programming', 'https://covers.openlibrary.org/b/isbn/9781617291784-L.jpg'),
('9781449373320', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'O''Reilly Media', 2017, 'programming', 'https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg'),
('9780134494166', 'Clean Architecture: A Craftsman''s Guide to Software Structure and Design', 'Robert C. Martin', 'Prentice Hall', 2017, 'programming', 'https://covers.openlibrary.org/b/isbn/9780134494166-L.jpg'),
('9781617294549', 'Microservices Patterns: With examples in Java', 'Chris Richardson', 'Manning Publications', 2018, 'programming', 'https://covers.openlibrary.org/b/isbn/9781617294549-L.jpg'),
('9781491950296', 'Building Microservices: Designing Fine-Grained Systems', 'Sam Newman', 'O''Reilly Media', 2015, 'programming', 'https://covers.openlibrary.org/b/isbn/9781491950296-L.jpg'),
('9781449331818', 'Learning React: Modern Patterns for Developing React Apps', 'Alex Banks, Eve Porcello', 'O''Reilly Media', 2020, 'programming', 'https://covers.openlibrary.org/b/isbn/9781449331818-L.jpg'),
('9780596520687', 'JavaScript: The Definitive Guide', 'David Flanagan', 'O''Reilly Media', 2020, 'programming', 'https://covers.openlibrary.org/b/isbn/9780596520687-L.jpg'),
('9780134032481', 'The DevOps Handbook: How to Create World-Class Agility, Reliability, & Security', 'Gene Kim, Jez Humble, Patrick Debois, John Willis', 'IT Revolution Press', 2016, 'programming', 'https://covers.openlibrary.org/b/isbn/9780134032481-L.jpg'),
('9781617294297', 'Kubernetes in Action', 'Marko Luksa', 'Manning Publications', 2017, 'programming', 'https://covers.openlibrary.org/b/isbn/9781617294297-L.jpg'),
('9781491946008', 'Fluent Python: Clear, Concise, and Effective Programming', 'Luciano Ramalho', 'O''Reilly Media', 2015, 'programming', 'https://covers.openlibrary.org/b/isbn/9781491946008-L.jpg'),
('9780134757599', 'Refactoring: Improving the Design of Existing Code', 'Martin Fowler', 'Addison-Wesley Professional', 2018, 'programming', 'https://covers.openlibrary.org/b/isbn/9780134757599-L.jpg'),
('9780596007126', 'Head First Design Patterns', 'Eric Freeman, Elisabeth Robson', 'O''Reilly Media', 2004, 'programming', 'https://covers.openlibrary.org/b/isbn/9780596007126-L.jpg'),
('9780135957059', 'The Pragmatic Programmer: Your Journey to Mastery', 'David Thomas, Andrew Hunt', 'Addison-Wesley Professional', 2019, 'programming', 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg'),
('9780321127426', 'Patterns of Enterprise Application Architecture', 'Martin Fowler', 'Addison-Wesley Professional', 2002, 'programming', 'https://covers.openlibrary.org/b/isbn/9780321127426-L.jpg'),

-- FANTASY BOOKS (15 books)
('9780547928227', 'The Hobbit', 'J.R.R. Tolkien', 'Houghton Mifflin Harcourt', 1937, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg'),
('9780345339683', 'The Fellowship of the Ring', 'J.R.R. Tolkien', 'Ballantine Books', 1954, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780345339683-L.jpg'),
('9780553103540', 'A Game of Thrones', 'George R.R. Martin', 'Bantam Books', 1996, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780553103540-L.jpg'),
('9780439708180', 'Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Scholastic Inc.', 1997, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg'),
('9780765311788', 'The Name of the Wind', 'Patrick Rothfuss', 'DAW Books', 2007, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780765311788-L.jpg'),
('9780316666275', 'The Lightning Thief', 'Rick Riordan', 'Miramax Books', 2005, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780316666275-L.jpg'),
('9780553573404', 'A Clash of Kings', 'George R.R. Martin', 'Bantam Books', 1998, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780553573404-L.jpg'),
('9780439358071', 'Harry Potter and the Chamber of Secrets', 'J.K. Rowling', 'Scholastic Inc.', 1998, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780439358071-L.jpg'),
('9780756404734', 'The Way of Kings', 'Brandon Sanderson', 'Tor Books', 2010, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780756404734-L.jpg'),
('9780765326355', 'The Wise Man''s Fear', 'Patrick Rothfuss', 'DAW Books', 2011, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780765326355-L.jpg'),
('9780765311771', 'Mistborn: The Final Empire', 'Brandon Sanderson', 'Tor Books', 2006, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780765311771-L.jpg'),
('9780439136358', 'Harry Potter and the Prisoner of Azkaban', 'J.K. Rowling', 'Scholastic Inc.', 1999, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780439136358-L.jpg'),
('9780553801477', 'A Storm of Swords', 'George R.R. Martin', 'Bantam Books', 2000, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780553801477-L.jpg'),
('9780345339706', 'The Two Towers', 'J.R.R. Tolkien', 'Ballantine Books', 1954, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780345339706-L.jpg'),
('9780345339713', 'The Return of the King', 'J.R.R. Tolkien', 'Ballantine Books', 1955, 'fantasy', 'https://covers.openlibrary.org/b/isbn/9780345339713-L.jpg'),

-- HORROR BOOKS (12 books)
('9780307743657', 'The Shining', 'Stephen King', 'Doubleday', 1977, 'horror', 'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg'),
('9780451169518', 'Carrie', 'Stephen King', 'Doubleday', 1974, 'horror', 'https://covers.openlibrary.org/b/isbn/9780451169518-L.jpg'),
('9780743477109', 'Pet Sematary', 'Stephen King', 'Doubleday', 1983, 'horror', 'https://covers.openlibrary.org/b/isbn/9780743477109-L.jpg'),
('9780486411095', 'Dracula', 'Bram Stoker', 'Archibald Constable and Company', 1897, 'horror', 'https://covers.openlibrary.org/b/isbn/9780486411095-L.jpg'),
('9780486270647', 'Frankenstein', 'Mary Shelley', 'Lackington, Hughes, Harding, Mavor & Jones', 1818, 'horror', 'https://covers.openlibrary.org/b/isbn/9780486270647-L.jpg'),
('9780143039983', 'The Strange Case of Dr. Jekyll and Mr. Hyde', 'Robert Louis Stevenson', 'Longmans, Green & Co.', 1886, 'horror', 'https://covers.openlibrary.org/b/isbn/9780143039983-L.jpg'),
('9780140437294', 'The Turn of the Screw', 'Henry James', 'Macmillan', 1898, 'horror', 'https://covers.openlibrary.org/b/isbn/9780140437294-L.jpg'),
('9780671047337', 'Salem''s Lot', 'Stephen King', 'Doubleday', 1975, 'horror', 'https://covers.openlibrary.org/b/isbn/9780671047337-L.jpg'),
('9780525432258', 'Bird Box', 'Josh Malerman', 'Ecco', 2014, 'horror', 'https://covers.openlibrary.org/b/isbn/9780525432258-L.jpg'),
('9780143129554', 'Mexican Gothic', 'Silvia Moreno-Garcia', 'Del Rey', 2020, 'horror', 'https://covers.openlibrary.org/b/isbn/9780143129554-L.jpg'),
('9780385121675', 'The Exorcist', 'William Peter Blatty', 'Harper & Row', 1971, 'horror', 'https://covers.openlibrary.org/b/isbn/9780385121675-L.jpg'),
('9780385338110', 'IT', 'Stephen King', 'Viking', 1986, 'horror', 'https://covers.openlibrary.org/b/isbn/9780385338110-L.jpg'),

-- NOVEL/LITERARY FICTION (12 books)
('9780451524935', '1984', 'George Orwell', 'Secker & Warburg', 1949, 'novel', 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg'),
('9780743273565', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Charles Scribner''s Sons', 1925, 'novel', 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg'),
('9780060935467', 'To Kill a Mockingbird', 'Harper Lee', 'J. B. Lippincott & Co.', 1960, 'novel', 'https://covers.openlibrary.org/b/isbn/9780060935467-L.jpg'),
('9780061120084', 'One Hundred Years of Solitude', 'Gabriel García Márquez', 'Harper & Row', 1967, 'novel', 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg'),
('9780316769174', 'The Catcher in the Rye', 'J.D. Salinger', 'Little, Brown and Company', 1951, 'novel', 'https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg'),
('9780679783268', 'Beloved', 'Toni Morrison', 'Alfred A. Knopf', 1987, 'novel', 'https://covers.openlibrary.org/b/isbn/9780679783268-L.jpg'),
('9780141182704', 'Of Mice and Men', 'John Steinbeck', 'Covici Friede', 1937, 'novel', 'https://covers.openlibrary.org/b/isbn/9780141182704-L.jpg'),
('9780544003415', 'The Lord of the Flies', 'William Golding', 'Faber & Faber', 1954, 'novel', 'https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg'),
('9780143105985', 'The Kite Runner', 'Khaled Hosseini', 'Riverhead Books', 2003, 'novel', 'https://covers.openlibrary.org/b/isbn/9780143105985-L.jpg'),
('9780385490818', 'The Da Vinci Code', 'Dan Brown', 'Doubleday', 2003, 'novel', 'https://covers.openlibrary.org/b/isbn/9780385490818-L.jpg'),
('9780316015844', 'Twilight', 'Stephenie Meyer', 'Little, Brown and Company', 2005, 'novel', 'https://covers.openlibrary.org/b/isbn/9780316015844-L.jpg'),
('9780316769532', 'The Fault in Our Stars', 'John Green', 'Dutton Books', 2012, 'novel', 'https://covers.openlibrary.org/b/isbn/9780316769532-L.jpg'),

-- SCIENCE FICTION (12 books)
('9780553382563', 'The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 'Pan Books', 1979, 'science-fiction', 'https://covers.openlibrary.org/b/isbn/9780553382563-L.jpg'),
('9780345404473', 'Foundation', 'Isaac Asimov', 'Gnome Press', 1951, 'science-fiction', 'https://covers.openlibrary.org/b/isbn/9780345404473-L.jpg'),
('9780441013593', 'Dune', 'Frank Herbert', 'Chilton Books', 1965, 'science-fiction', 'https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg'),
('9780575094185', 'Neuromancer', 'William Gibson', 'Ace Books', 1984, 'science-fiction', 'https://covers.openlibrary.org/b/isbn/9780575094185-L.jpg'),
('9780553283686', 'Ender''s Game', 'Orson Scott Card', 'Tor Books', 1985, 'science-fiction', 'https://covers.openlibrary.org/b/isbn/9780553283686-L.jpg'),
('9780345391803', 'The Handmaid''s Tale', 'Margaret Atwood', 'McClelland & Stewart', 1985, 'science-fiction', 'https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg'),
('9780553293357', 'Fahrenheit 451', 'Ray Bradbury', 'Ballantine Books', 1953, 'science-fiction', 'https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg'),
('9780441172719', 'Starship Troopers', 'Robert A. Heinlein', 'G. P. Putnam''s Sons', 1959, 'science-fiction', 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg'),
('9780345334305', 'I, Robot', 'Isaac Asimov', 'Gnome Press', 1950, 'science-fiction', 'https://covers.openlibrary.org/b/isbn/9780345334305-L.jpg'),
('9780060850524', 'Brave New World', 'Aldous Huxley', 'Chatto & Windus', 1932, 'science-fiction', 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg'),
('9780553418026', 'The Martian', 'Andy Weir', 'Crown Publishing', 2011, 'science-fiction', 'https://covers.openlibrary.org/b/isbn/9780553418026-L.jpg'),
('9780486284729', 'The Time Machine', 'H.G. Wells', 'William Heinemann', 1895, 'science-fiction', 'https://covers.openlibrary.org/b/isbn/9780486284729-L.jpg'),

-- MYSTERY/THRILLER (10 books)
('9780062073488', 'And Then There Were None', 'Agatha Christie', 'Collins Crime Club', 1939, 'mystery', 'https://covers.openlibrary.org/b/isbn/9780062073488-L.jpg'),
('9780393325195', 'The Murder of Roger Ackroyd', 'Agatha Christie', 'William Collins, Sons', 1926, 'mystery', 'https://covers.openlibrary.org/b/isbn/9780393325195-L.jpg'),
('9780307588364', 'Gone Girl', 'Gillian Flynn', 'Crown Publishers', 2012, 'mystery', 'https://covers.openlibrary.org/b/isbn/9780307588364-L.jpg'),
('9780307454546', 'The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Norstedts Förlag', 2005, 'mystery', 'https://covers.openlibrary.org/b/isbn/9780307454546-L.jpg'),
('9780143127550', 'The Big Sleep', 'Raymond Chandler', 'Alfred A. Knopf', 1939, 'mystery', 'https://covers.openlibrary.org/b/isbn/9780143127550-L.jpg'),
('9780486264745', 'The Adventures of Sherlock Holmes', 'Arthur Conan Doyle', 'George Newnes', 1892, 'mystery', 'https://covers.openlibrary.org/b/isbn/9780486264745-L.jpg'),
('9780307278586', 'In Cold Blood', 'Truman Capote', 'Random House', 1966, 'mystery', 'https://covers.openlibrary.org/b/isbn/9780307278586-L.jpg'),
('9780307595171', 'The Silence of the Lambs', 'Thomas Harris', 'St. Martin''s Press', 1988, 'mystery', 'https://covers.openlibrary.org/b/isbn/9780307595171-L.jpg'),
('9780375719202', 'The Talented Mr. Ripley', 'Patricia Highsmith', 'Coward-McCann', 1955, 'mystery', 'https://covers.openlibrary.org/b/isbn/9780375719202-L.jpg'),
('9780553212952', 'The Maltese Falcon', 'Dashiell Hammett', 'Alfred A. Knopf', 1930, 'mystery', 'https://covers.openlibrary.org/b/isbn/9780553212952-L.jpg'),

-- ROMANCE (8 books)
('9780142437339', 'Pride and Prejudice', 'Jane Austen', 'T. Egerton', 1813, 'romance', 'https://covers.openlibrary.org/b/isbn/9780142437339-L.jpg'),
('9780486415871', 'Jane Eyre', 'Charlotte Brontë', 'Smith, Elder & Co.', 1847, 'romance', 'https://covers.openlibrary.org/b/isbn/9780486415871-L.jpg'),
('9780486290492', 'Sense and Sensibility', 'Jane Austen', 'Thomas Egerton', 1811, 'romance', 'https://covers.openlibrary.org/b/isbn/9780486290492-L.jpg'),
('9780446365383', 'The Notebook', 'Nicholas Sparks', 'Warner Books', 1996, 'romance', 'https://covers.openlibrary.org/b/isbn/9780446365383-L.jpg'),
('9780380730407', 'Outlander', 'Diana Gabaldon', 'Delacorte Press', 1991, 'romance', 'https://covers.openlibrary.org/b/isbn/9780380730407-L.jpg'),
('9780670026609', 'Me Before You', 'Jojo Moyes', 'Pamela Dorman Books', 2012, 'romance', 'https://covers.openlibrary.org/b/isbn/9780670026609-L.jpg'),
('9781501110368', 'It Ends with Us', 'Colleen Hoover', 'Atria Books', 2016, 'romance', 'https://covers.openlibrary.org/b/isbn/9781501110368-L.jpg'),
('9780525478812', 'The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', 'Atria Books', 2017, 'romance', 'https://covers.openlibrary.org/b/isbn/9780525478812-L.jpg')
ON CONFLICT (isbn) DO NOTHING;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

-- +goose StatementEnd
