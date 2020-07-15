CREATE TABLE IF NOT EXISTS `comment` (
  `comment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `post_web_id` BIGINT NOT NULL,
  `comment_web_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `comment_content` varchar(500) NOT NULL,
  `modifyTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);