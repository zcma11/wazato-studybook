class Heap {
  constructor(compare) {
      this.data = []
      this.compare = compare
  }

  size() {
      return this.data.length
  }

  swap(a, b) {
      const { data } = this
      const temp = data[a]
      data[a] = data[b]
      data[b] = temp
  }

  push(val) {
      this.data.push(val)
      this.bubblingUp(this.size() - 1)
  }

  pop() {
      if (this.size() === 0) return
      const discard = this.data[0]

      const temp = this.data.pop()

      if (this.size() > 0) {
          this.data[0] = temp
          this.bubblingDown(0)
      }

      return discard
  }

  bubblingUp(index) {
      while (index > 0) {
          const { data } = this
          const parent = (index - 1) >> 1
          if (this.compare(data[index], data[parent]) < 0) {
              this.swap(parent, index)
              index = parent
          } else {
              break
          }
      }
  }

  bubblingDown(index) {
      const { data } = this
      const last = this.size() - 1
      while (true) {
          const left = index * 2 + 1
          const right = index * 2 + 2
          let parent = index
          if (left <= last && this.compare(data[left], data[parent]) < 0) {
              parent = left
          }

          if (right <= last && this.compare(data[right], data[parent]) < 0) {
              parent = right
          }

          if (parent !== index) {
              this.swap(parent, index)
              index = parent
          } else {
              break
          }
      }
  }
}