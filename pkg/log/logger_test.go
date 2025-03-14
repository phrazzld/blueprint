package log

import (
	"bytes"
	"encoding/json"
	"strings"
	"testing"
)

func TestLogger(t *testing.T) {
	// Create a buffer to capture log output
	var buf bytes.Buffer
	
	// Create a logger with the buffer as the writer
	logger := NewLogger(DEBUG)
	logger.Writer = &buf
	
	// Test logging at different levels
	logger.Debug("Debug message", map[string]string{"key": "value"})
	logger.Info("Info message")
	logger.Warn("Warning message")
	logger.Error("Error message")
	
	// Split the buffer into lines
	lines := strings.Split(strings.TrimSpace(buf.String()), "\n")
	
	// Check that we have 4 log entries
	if len(lines) != 4 {
		t.Errorf("Expected 4 log entries, got %d", len(lines))
	}
	
	// Check the content of each log entry
	checkLogEntry(t, lines[0], DEBUG, "Debug message", true)
	checkLogEntry(t, lines[1], INFO, "Info message", false)
	checkLogEntry(t, lines[2], WARN, "Warning message", false)
	checkLogEntry(t, lines[3], ERROR, "Error message", false)
	
	// Test log level filtering
	buf.Reset()
	logger.Level = INFO
	
	logger.Debug("Debug message") // This should be filtered out
	logger.Info("Info message")
	
	lines = strings.Split(strings.TrimSpace(buf.String()), "\n")
	
	// Check that we have 1 log entry (Debug was filtered out)
	if len(lines) != 1 {
		t.Errorf("Expected 1 log entry, got %d", len(lines))
	}
	
	// Check the content of the log entry
	checkLogEntry(t, lines[0], INFO, "Info message", false)
}

// checkLogEntry checks the content of a log entry
func checkLogEntry(t *testing.T, line string, level Level, message string, hasData bool) {
	var entry LogEntry
	if err := json.Unmarshal([]byte(line), &entry); err != nil {
		t.Errorf("Error unmarshalling log entry: %v", err)
		return
	}
	
	if entry.Level != string(level) {
		t.Errorf("Expected log level '%s', got '%s'", level, entry.Level)
	}
	
	if entry.Message != message {
		t.Errorf("Expected message '%s', got '%s'", message, entry.Message)
	}
	
	if hasData && entry.Data == nil {
		t.Error("Expected data, but got nil")
	}
	
	if !hasData && entry.Data != nil {
		t.Errorf("Expected no data, but got %v", entry.Data)
	}
}