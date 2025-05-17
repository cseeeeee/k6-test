package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ClickEventController {
    private int clickCount = 0;

    @GetMapping("/event")
    public String home(Model model) {
        model.addAttribute("clickCount", clickCount);
        return "event";
    }
}
