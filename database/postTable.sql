CREATE TABLE IF NOT EXISTS `post` (
  `post_id` INT AUTO_INCREMENT PRIMARY KEY,
  `web_id` INT NOT NULL,
  `user_id` INT,
  `title` varchar(100) NOT NULL,
  `content` varchar(500) NOT NULL,
  `num_likes` INT NOT NULL DEFAULT '0',
  `time_start` timestamp NOT NULL,
  `modifyTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);