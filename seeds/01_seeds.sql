INSERT INTO users (name, email, password)
VALUES ('Marco', 'marco01@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Sam', 'sam@user.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Francios', 'thefrank01@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Sheila', 'Sheila1963@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Patty', 'pattycakecake@thefunbakery.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Wilson', 'willpower@gravitron.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Frankie', 'mrclean@protonmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, country, street, city, province, post_code)
VALUES ('1', 'title1', 'description', 'https://images.unsplash.com/photo-1430285561322-7808604715df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 175, 'Canada', '203 Kimta Rd', 'Victoria', 'BC', 'V9A6T5'),
('2', 'title2', 'description', 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 190, 'Canada', '1447 White Pine Terr', 'Victoria', 'BC', 'V9B6J3'),
('4', 'title3', 'description', 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 168, 'Canada', '3421 Bonair Pl', 'Vicria', 'BC', 'V8P4V5'),
('5', 'title4', 'description', 'https://images.unsplash.com/photo-1597047084897-51e81819a499?ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 225, 'Canada', '1148 Balmoral Rd', 'Victoria', 'BC', 'V8T1B1');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2019-12-17', '2019-12-22', 2, 4),
('2020-05-01', '2020-05-09', 3, 2),
('2020-08-29', '2020-09-16', 4, 6);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 4, 1, 5, 'One of the best experiences staying anywhere ever!'),
(3, 3, 2, 3, 'No view from the room, clean but not thrilling'),
(6, 4, 3, 4, 'Had a wonderful time at this lightBnB our host was awesome');