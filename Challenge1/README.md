

# The Josephus Challenge
## Live Demo
 (open)[https://josephus-challenge1.netlify.app/]
## The Story Behind The Problem

Imagine you're in a village with your friends - Abebe, Kebede, Chala, Tola, and Girma. One terrifying day, terrorists capture all of you. They have a twisted game: everyone stands in a circle, and they count to **3**. Every **3rd person** is killed. They keep counting until only one person remains. That one person gets to live.

**The question is:** Where should you stand to be that last person?

---

## 📖 What You Need To Do

Your mission is to write a function that finds the survivor's position, no matter how many people are in the circle or what the count is.

### The Rules

* People stand in a circle.
* Counting starts from the first person.
* Every **Kth** person is eliminated.
* After each elimination, counting continues from the next person.
* The last person remaining is the survivor.

---

## 🧠 Understanding The Algorithm

Let's walk through how this works step by step.

### Step 1: Setting Up Our Circle

```javascript
const peopleList = ['Abebe', 'Kebede', 'Chala', 'Tola', 'Girma'];
const iteration = 3; // Count to 3
```

Picture everyone standing in a circle:

```text
      Abebe
   Girma    Kebede
     Tola    Chala
```

---

### Step 2: The Counting Begins

We start counting from **Abebe** (position 0):

```text
Count 1: Abebe
Count 2: Kebede
Count 3: Chala  ← Chala is eliminated
```

#### What just happened?

* We counted 3 people starting from Abebe.
* Chala was the 3rd person.
* Chala is removed from the circle.
* The next round starts from Tola (the person after Chala).

---

### Step 3: The Circle Gets Smaller

Now our circle looks like this:

```javascript
['Abebe', 'Kebede', 'Tola', 'Girma']
```

Visual representation:

```text
      Abebe
   Girma    Kebede
       Tola
```

---

### Step 4: Keep Counting!

We continue counting from **Tola**:

```text
Count 1: Tola
Count 2: Girma
Count 3: Abebe  ← Abebe is eliminated
```

---

### Step 5: The Pattern Continues

#### Round 3

Remaining:

```javascript
['Kebede', 'Tola', 'Girma']
```

Count from Kebede:

```text
1: Kebede
2: Tola
3: Girma  ← Girma is eliminated
```

#### Round 4

Remaining:

```javascript
['Kebede', 'Tola']
```

Count from Kebede:

```text
1: Kebede
2: Tola
3: Kebede  ← Kebede is eliminated
```

---

## 🏆 Final Survivor

```text
Tola
```

Tola is the last person remaining and therefore survives.

---

## Example

### Input

```javascript
people = ['Abebe', 'Kebede', 'Chala', 'Tola', 'Girma'];
k = 3;
```

### Elimination Order

```text
Chala → Abebe → Girma → Kebede
```

### Output

```text
Tola
```


