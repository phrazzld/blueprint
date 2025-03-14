package log

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"time"
)

// Level represents the log level
type Level string

const (
	// DEBUG level for debugging information
	DEBUG Level = "debug"
	
	// INFO level for general information
	INFO Level = "info"
	
	// WARN level for warnings
	WARN Level = "warn"
	
	// ERROR level for errors
	ERROR Level = "error"
)

// Logger is a structured logger
type Logger struct {
	Writer io.Writer
	Level  Level
}

// LogEntry represents a log entry
type LogEntry struct {
	Timestamp string      `json:"timestamp"`
	Level     string      `json:"level"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data,omitempty"`
}

// NewLogger creates a new logger
func NewLogger(level Level) *Logger {
	return &Logger{
		Writer: os.Stdout,
		Level:  level,
	}
}

// Debug logs at DEBUG level
func (l *Logger) Debug(message string, data ...interface{}) {
	if l.shouldLog(DEBUG) {
		l.log(DEBUG, message, data...)
	}
}

// Info logs at INFO level
func (l *Logger) Info(message string, data ...interface{}) {
	if l.shouldLog(INFO) {
		l.log(INFO, message, data...)
	}
}

// Warn logs at WARN level
func (l *Logger) Warn(message string, data ...interface{}) {
	if l.shouldLog(WARN) {
		l.log(WARN, message, data...)
	}
}

// Error logs at ERROR level
func (l *Logger) Error(message string, data ...interface{}) {
	if l.shouldLog(ERROR) {
		l.log(ERROR, message, data...)
	}
}

// log logs a message at the specified level
func (l *Logger) log(level Level, message string, data ...interface{}) {
	entry := LogEntry{
		Timestamp: time.Now().Format(time.RFC3339),
		Level:     string(level),
		Message:   message,
	}
	
	if len(data) > 0 {
		entry.Data = data[0]
	}
	
	jsonData, err := json.Marshal(entry)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error marshalling log entry: %v\n", err)
		return
	}
	
	fmt.Fprintln(l.Writer, string(jsonData))
}

// shouldLog returns whether the logger should log at the specified level
func (l *Logger) shouldLog(level Level) bool {
	switch l.Level {
	case DEBUG:
		return true
	case INFO:
		return level != DEBUG
	case WARN:
		return level != DEBUG && level != INFO
	case ERROR:
		return level == ERROR
	default:
		return true
	}
}