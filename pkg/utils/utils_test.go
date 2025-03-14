package utils

import "testing"

func TestBasicFunctionality(t *testing.T) {
	// A simple test to verify testing framework works
	expected := true
	actual := true
	
	if actual != expected {
		t.Errorf("Expected %v, got %v", expected, actual)
	}
}