package com.controller

import com.services.OpenAIService
import org.springframework.web.bind.annotation.*

data class QuestionRequest(val question: String)
data class AnswerResponse(val answer: String)

@RestController
@RequestMapping("/v1/api/chat")
@CrossOrigin(origins = ["*"])
class ChatController(private val openAIService: OpenAIService) {

    @PostMapping("/ask")
    fun askQuestion(@RequestBody request: QuestionRequest): AnswerResponse {
        val question = request.question
        val answer = openAIService.askQuestion(question)
        return AnswerResponse(answer)
    }
}
