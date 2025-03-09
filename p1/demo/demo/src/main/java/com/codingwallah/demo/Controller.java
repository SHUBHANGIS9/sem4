package com.codingwallah.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class Controller {

    @GetMapping("/get")
    public String doGet(){
    return "hi me guglu";}
    @PostMapping("/post")
    public String doPost(){
        return "Hi i am shubhangi";
    }
}
