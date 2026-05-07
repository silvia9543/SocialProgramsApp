package com.services

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.io.IOException

@Service
class OpenAIService {

    @Value("\${openrouter.api.key}")
    private lateinit var apiKey: String

    private val client = OkHttpClient()
    private val objectMapper = jacksonObjectMapper()

    fun askQuestion(question: String): String {
        // Choose a free model available on OpenRouter
        val modelName = "gpt-4o-mini:openrouter" // or any free model listed in OpenRouter docs

        val json = """
            {
                "model": "$modelName",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant for social programs in the United States."},
                    {"role": "user", "content": "${question.replace("\"", "\\\"")}"}
                ],
                "temperature": 0.7
            }
        """.trimIndent()

        val body = json.toRequestBody("application/json".toMediaType())
        val request = Request.Builder()
                .url("https://openrouter.ai/api/v1/chat/completions")
                .addHeader("Authorization", "Bearer $apiKey")
                .post(body)
                .build()

        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) {
                throw IOException("Unexpected code $response. Response body: ${response.body?.string()}")
            }

            val responseJson: JsonNode = objectMapper.readTree(response.body!!.string())
            return responseJson["choices"][0]["message"]["content"].asText()
        }
    }
}
