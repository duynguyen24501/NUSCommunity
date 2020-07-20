CREATE TABLE IF NOT EXISTS `comment` (
  `comment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `post_web_id` BIGINT NOT NULL,
  `comment_web_id` BIGINT NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `value` varchar(500) NOT NULL,
  `time` BIGINT NOT NULL,
  `modifyTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);