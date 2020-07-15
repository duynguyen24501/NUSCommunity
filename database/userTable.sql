CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(65) NOT NULL,
  `password` varchar(65) NOT NULL,
  `username` varchar(65),
  `bio` varchar(500),
  `verified` BOOLEAN NOT NULL DEFAULT false,
  `points` INT NOT NULL DEFAULT '0',
  `modifyTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY `unique_email` (`email`)
);