-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8mb3 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`professor_tbl`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`professor_tbl` (
  `pro_no` INT NOT NULL COMMENT '교수번호',
  `pro_name` VARCHAR(45) NOT NULL COMMENT '교수이름',
  `pro_pwd` VARCHAR(45) NOT NULL COMMENT '교수비번',
  PRIMARY KEY (`pro_no`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`student_tbl`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`student_tbl` (
  `stu_no` INT NOT NULL COMMENT '학번',
  `stu_name` VARCHAR(45) NOT NULL COMMENT '학생이름',
  `stu_pwd` VARCHAR(45) NOT NULL COMMENT '학생비번',
  PRIMARY KEY (`stu_no`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`subject_tbl`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`subject_tbl` (
  `sub_code` VARCHAR(5) NOT NULL COMMENT '과목코드',
  `sub_name` VARCHAR(45) NOT NULL COMMENT '과목명',
  `pro_no` INT NULL COMMENT '교수번호',
  PRIMARY KEY (`sub_code`),
  UNIQUE INDEX `sub_code_UNIQUE` (`sub_code` ASC) VISIBLE,
  INDEX `fk_subject_tbl_pro_no_idx` (`pro_no` ASC) VISIBLE,
  CONSTRAINT `fk_subject_tbl_pro_no`
    FOREIGN KEY (`pro_no`)
    REFERENCES `mydb`.`professor_tbl` (`pro_no`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`attend_tbl`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`attend_tbl` (
  `stu_no` INT NOT NULL COMMENT '학번',
  `sub_code` VARCHAR(5) NULL DEFAULT NULL COMMENT '과목코드',
  `pro_no` INT NOT NULL COMMENT '교수번호',
  `att_year` INT NULL DEFAULT NULL COMMENT '수강년도',
  `att_term` INT NULL DEFAULT NULL COMMENT '수강학기',
  `att_grade` VARCHAR(45) NULL DEFAULT '0' COMMENT '취득점수',
  PRIMARY KEY (`stu_no`, `pro_no`),
  INDEX `fk_attend_p_no_idx` (`pro_no` ASC) VISIBLE,
  INDEX `fk_attend_sub_code_idx` (`sub_code` ASC) VISIBLE,
  CONSTRAINT `fk_attend_pro_no`
    FOREIGN KEY (`pro_no`)
    REFERENCES `mydb`.`professor_tbl` (`pro_no`),
  CONSTRAINT `fk_attend_stu_no`
    FOREIGN KEY (`stu_no`)
    REFERENCES `mydb`.`student_tbl` (`stu_no`),
  CONSTRAINT `fk_attend_sub_code`
    FOREIGN KEY (`sub_code`)
    REFERENCES `mydb`.`subject_tbl` (`sub_code`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`board_tbl`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`board_tbl` (
  `bod_no` INT NOT NULL AUTO_INCREMENT COMMENT '게시글 번호',
  `sub_code` VARCHAR(5) NOT NULL COMMENT '교과목 번호',
  `pro_no` INT NOT NULL COMMENT '교수번호(작성자)',
  `bod_title` VARCHAR(150) NOT NULL COMMENT '게시글 제목',
  `bod_content` TEXT NOT NULL COMMENT '게시글 본문',
  `bod_image` VARCHAR(200) NULL DEFAULT NULL COMMENT '게시글 이미지',
  `bod_regdate` DATETIME NULL DEFAULT NULL COMMENT '게시글 등록일자',
  `bod_update` DATETIME NULL DEFAULT NULL COMMENT '게시글 수정일자',
  `bod_deldate` DATETIME NULL DEFAULT NULL COMMENT '게시글 삭제일자',
  PRIMARY KEY (`bod_no`),
  INDEX `fd_board_crator_id_idx` (`pro_no` ASC) VISIBLE,
  CONSTRAINT `fk_bod_pro_no`
    FOREIGN KEY (`pro_no`)
    REFERENCES `mydb`.`professor_tbl` (`pro_no`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`score_tbl`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`score_tbl` (
  `stu_no` INT NOT NULL COMMENT '학번',
  `sco_year` INT NOT NULL COMMENT '성적취득년도',
  `sco_term` INT NOT NULL COMMENT '학기',
  `sco_avg` INT NULL DEFAULT NULL COMMENT '평점평균',
  PRIMARY KEY (`stu_no`, `sco_year`, `sco_term`),
  CONSTRAINT `fk_score_stu_no`
    FOREIGN KEY (`stu_no`)
    REFERENCES `mydb`.`student_tbl` (`stu_no`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
