/**
 * @file src/utils/getNextVersion.js
 *
 * Copyright (c) 2020 Simon Fraser University
 * Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 *
 * @brief Helper to try and guess the next version of a plugin based on the current version (found in version.xml)
 *
 */
const getNextVersion = currentVersion => {
  try {
    const numbers = currentVersion.split('.').map(char => Number(char))
    const lastNumberIndex = numbers.length - 1
    const lastNumber = Number(numbers[lastNumberIndex]) + 1
    numbers.splice(lastNumberIndex, 1, lastNumber)
    return numbers.join('.')
  } catch (err) {
    return currentVersion
  }
}

module.exports = getNextVersion
