/*
MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : vk-auth

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `lessons`
-- ----------------------------
DROP TABLE IF EXISTS `lessons`;
CREATE TABLE `lessons` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `programmingLanguageId` int(11) NOT NULL,
  `levelId` int(11) NOT NULL,
  `name` text NOT NULL,
  `description` text DEFAULT NULL,
  `isPublished` tinyint(1) NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lessons
-- ----------------------------

-- ----------------------------
-- Table structure for `levels`
-- ----------------------------
DROP TABLE IF EXISTS `levels`;
CREATE TABLE `levels` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of levels
-- ----------------------------
INSERT INTO `levels` VALUES ('1', 'Beginner Course', null, null);
INSERT INTO `levels` VALUES ('2', 'Medium Course', null, null);
INSERT INTO `levels` VALUES ('3', 'Hard Course', null, null);

-- ----------------------------
-- Table structure for `programminglanguages`
-- ----------------------------
DROP TABLE IF EXISTS `programminglanguages`;
CREATE TABLE `programminglanguages` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of programminglanguages
-- ----------------------------
INSERT INTO `programminglanguages` VALUES ('1', 'Javascript', null, null);
INSERT INTO `programminglanguages` VALUES ('2', 'C#', null, null);
INSERT INTO `programminglanguages` VALUES ('3', 'C++', null, null);

-- ----------------------------
-- Table structure for `roles`
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES ('1', 'Student', null, null);
INSERT INTO `roles` VALUES ('2', 'Lecturer', null, null);

-- ----------------------------
-- Table structure for `slides`
-- ----------------------------
DROP TABLE IF EXISTS `slides`;
CREATE TABLE `slides` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `topicId` int(11) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `isAnswerable` tinyint(1) NOT NULL,
  `answer` text NOT NULL,
  `sequenceNumber` int(11) NOT NULL,
  `isPublished` tinyint(1) NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of slides
-- ----------------------------

-- ----------------------------
-- Table structure for `topics`
-- ----------------------------
DROP TABLE IF EXISTS `topics`;
CREATE TABLE `topics` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `lessonId` int(11) NOT NULL,
  `name` text NOT NULL,
  `sequenceNumber` int(11) NOT NULL,
  `isPublished` tinyint(1) NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of topics
-- ----------------------------

-- ----------------------------
-- Table structure for `userlessonhistories`
-- ----------------------------
DROP TABLE IF EXISTS `userlessonhistories`;
CREATE TABLE `userlessonhistories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `topicId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `slideId` int(11) NOT NULL,
  `isTopicFinished` tinyint(1) NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of userlessonhistories
-- ----------------------------

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `hashId` text NOT NULL,
  `roleId` int(11) NOT NULL,
  `firstname` text NOT NULL,
  `lastname` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of users
-- ----------------------------

DROP TRIGGER IF EXISTS `trg_ins_hash`;
DELIMITER ;;
CREATE TRIGGER `trg_ins_hash` BEFORE INSERT ON `users` FOR EACH ROW BEGIN

    SET @string := 'abcdefghijklmnopqrstuvwxyz0123456789';
    SET @i := 1;
    SET @hash := '';

    WHILE (@i <= 32) DO
        SET @hash := CONCAT(@hash, SUBSTRING(@string, FLOOR(RAND() * 36 + 1), 1));
        SET @i := @i + 1;
    END WHILE;

    SET NEW.hashId := @hash;

END
;;
DELIMITER ;
