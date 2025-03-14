package cli

import (
	"testing"
)

func TestValidateProjectName(t *testing.T) {
	testCases := []struct {
		name     string
		input    string
		expected bool
	}{
		{"Valid name", "my-project", true},
		{"Valid name with numbers", "project123", true},
		{"Valid name with underscore", "my_project", true},
		{"Valid name with dot", "my.project", true},
		{"Empty name", "", false},
		{"Name with spaces", "my project", false},
		{"Name with special chars", "my@project", false},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			err := validateProjectName(tc.input)
			if tc.expected && err != nil {
				t.Errorf("Expected valid project name '%s', but got error: %v", tc.input, err)
			}
			if !tc.expected && err == nil {
				t.Errorf("Expected error for invalid project name '%s', but got none", tc.input)
			}
		})
	}
}

// Note: We can't easily test the full prompt functionality in a unit test
// because it requires user interaction. We could use a testing framework
// that allows mocking user input, but for simplicity, we'll just test
// the validation function.