package utils

// IsEmpty checks if a string is empty
func IsEmpty(s string) bool {
	return s == ""
}

// Contains checks if a slice contains a value
func Contains[T comparable](slice []T, val T) bool {
	for _, item := range slice {
		if item == val {
			return true
		}
	}
	return false
}