const mongoose = require('mongoose');
const slugify = require('slugify');

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Gig title must be provided'],
    trim: true,
    maxlength: [40, 'A gig name must equal or be under 40 characters'],
    minlength: [5, 'A gig name must have more than 4 characters']
    // can also provide custom or 3rd party validators, check mongoose docs, npm i validator
  },
  venue: String,
  venueAddress: {
    type: String,
    required: [true, 'Venue address must be provided']
  },
  time: {
    type: String,
    required: [true, 'Gig start time must be provided'],
    unique: true
  },
  gigDuration: Number,
  musicians: Object,
  public: {
    type: Boolean,
    default: true
  },
  restaurant: Boolean,
  description: {
    type: String,
    trim: true
  },
  suit: {
    type: String,
    enum: {
      values: ['black', 'canada', 'red', 'grey', 'brown']
    }
  },
  notes: {
    type: String,
    maxlength: [500, 'note must not be longer than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  slug: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ** use virtual for time formatting later **
gigSchema.virtual('durationMinutes').get(function () {
  return this.gigDuration * 60;
})

// Document middleware, runs before .save() command & .create()
gigSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
})

// Middlware examples:
// gigSchema.pre('save', function (next) {
//   console.log('Second pre on "save"')
//   next();
// })

// gigSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// })

// QUERY MIDDLEWARE 
gigSchema.pre(/^find/, function (next) {
  this.find({ public: { $ne: false } })
  next();
});

const Gig = mongoose.model('Gig', gigSchema);

module.exports = Gig;